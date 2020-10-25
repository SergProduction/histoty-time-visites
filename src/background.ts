import { isStorageAreaExistMyContent, ItemHistoryVisit } from './core/types'
import { fetchGET } from './core/lib'



fetchGET().then(console.log)




type ParamsItemHistoty = { title: string, url: string }

class Store {
  state: ItemHistoryVisit[]
  prev: null | ItemHistoryVisit
  constructor() {
    this.prev = null
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
    if (this.prev !== null) {
      const prevComplite = { ...this.prev, end: Date.now() }
      this.state.push(prevComplite)
    }
    this.setPrev(p)
  }

  closeLastSession() {
    // TODO: end undefined
    this.state[this.state.length-1].end = Date.now()
  }

  clear() {
    this.state = []
  }
}

const tempStoreHistoryVisit = new Store()

const initStore = () => {
  chrome.storage.local.get((items) => {
    if (items.historyVisit === undefined) {
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({ historyVisit: [] })
      })
    }
  })
}


const save = ()  => {
  chrome.storage.local.get(items => {
    if (!isStorageAreaExistMyContent(items)) return

    console.log('chrome.storage.local.get', items)

    chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
      // 5,242,880 max limit local storage
      if (bytesInUse >= 500000) {
        console.log('fifty limit, should be send data fetch and save to server')
      }
    })

    chrome.storage.local.set({ historyVisit: [...items.historyVisit, ...tempStoreHistoryVisit.state ] }, ()  => {
      tempStoreHistoryVisit.clear()
    })
  })
}

const listenStoreAndSave = () => {
  setTimeout(() => {
    save()
    listenStoreAndSave()
  }, 20 * 1000)
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('chrome.runtime.onInstalled')
  initStore()
  listenStoreAndSave()
})


chrome.runtime.onStartup.addListener(() => {
  console.log('chrome.runtime.onStartup')
  listenStoreAndSave()
})


// TODO: Учитывать активность трекая мышку, потерю фокуса окна, возвращению фокуса
// TODO: При выходе надо завершать ItemHistoryVisit, иначе она завершится только при открытии новой вкадки
// TODO: Не учитывать короткое время жизни ItemHistoryVisit, это может быть обычное переключение вкладок
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    // console.log('a', {tab})
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return
    tempStoreHistoryVisit.push({ title: tab.title, url: tab.url })
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('b', {changeInfo, tab})
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return
  tempStoreHistoryVisit.push({ title: tab.title, url: tab.url })
})

chrome.windows.onRemoved.addListener(windowId => {
  // close window
  tempStoreHistoryVisit.closeLastSession()
  save()
})