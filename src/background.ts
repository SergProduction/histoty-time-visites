// const tempStore: PageVisitItem[] = []


// примерно 250 байт стоит такой объект с 4 полями
type ItemHistoryVisit = {
  title: string,
  url: string,
  start: number,
  end: null | number
}

type ParamsItemHistoty = { title: string, url: string }

class Store {
  state: ItemHistoryVisit[]
  prev: ItemHistoryVisit
  constructor() {
    this.prev = {
      title: '~init',
      url: '~init',
      start: Date.now(),
      end: null
    }
    this.state = []
  }

  setPrev({ title, url }: ParamsItemHistoty) {
    this.prev = {
      title,
      url,
      start: Date.now(),
      end: null
    }
  }

  push(p: ParamsItemHistoty) {
    const prevComplite = { ...this.prev, end: Date.now() }
    this.state.push(prevComplite)
    this.setPrev(p)
  }

  clear() {
    this.state = []
  }
}

const storeHistoryVisit = new Store()


const listenStoreAndSave = () => {
  setTimeout(() => {

    chrome.storage.local.get((items) => {
      console.log('chrome.storage.local.get', items)

      chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
        // 1,000,000 max limit local storage
        if (bytesInUse >= 500000) {
          console.log('fifty limit, should be send data fetch and save to server')
        }
      })

      chrome.storage.local.set({ historyVisit: [...storeHistoryVisit.state, ...items.historyVisit ] }, ()  => {
        storeHistoryVisit.clear()
      })
    })

    listenStoreAndSave()
  }, 30 * 1000)
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('chrome.runtime.onInstalled')
  chrome.storage.local.get((items) => {
    if (items.historyVisit === undefined) {
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({ historyVisit: [] })
      })
    }
  })
  listenStoreAndSave()
})


chrome.runtime.onStartup.addListener(() => {
  console.log('chrome.runtime.onStartup')
  listenStoreAndSave()
})


chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    console.log('a', {tab})
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return
    storeHistoryVisit.push({ title: tab.title, url: tab.url })
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('b', {changeInfo, tab})
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return
  storeHistoryVisit.push({ title: tab.title, url: tab.url })
})

