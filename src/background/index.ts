import { ItemHistoryVisit } from '../core/types'
import { fetchGET } from '../core/lib'
import { addHistoryVisit, getHistoryVisit, getBytesInUse, createTabAwaitComplite } from './helpers'


// fetchGET().then(console.log)

let windowIdUserLastUse: undefined | number = undefined

chrome.browserAction.onClicked.addListener(async function (tab) {
  const pathToAppHtml = chrome.runtime.getURL("dist/index.html")

  const createdTab = await createTabAwaitComplite({
    active: true,
    url: pathToAppHtml,
    windowId: windowIdUserLastUse
  })

  const historyVisit = await getHistoryVisit()

  // но такого не может быть
  if (!createdTab.id) return

  chrome.tabs.sendMessage(
    createdTab.id,
    { type: "historyVisit", payload: historyVisit }
  )
})

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
    if (this.state.length > 0) {
      this.state[this.state.length - 1].end = Date.now()
    }
  }

  clear() {
    this.state = []
  }
}

const tempStoreHistoryVisit = new Store()

const initStore = () => {
  getHistoryVisit()
    .catch(() => {
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({ historyVisit: [] })
      })
    })
}


const save = () => {
  addHistoryVisit(tempStoreHistoryVisit.state)
    .then(() => tempStoreHistoryVisit.clear())
    .then(getBytesInUse)
    .then(bytesInUse => {
      if (bytesInUse >= 500000) {
        console.warn(`bytesInUse ${bytesInUse}`)
      }
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
    windowIdUserLastUse = tab.windowId
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return
    
    tempStoreHistoryVisit.push({ title: tab.title, url: tab.url })
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return

  tempStoreHistoryVisit.push({ title: tab.title, url: tab.url })
})


chrome.windows.onRemoved.addListener(windowId => {
  // close window
  tempStoreHistoryVisit.closeLastSession()
  save()
})