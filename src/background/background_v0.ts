import "regenerator-runtime"
import { CancableTimeout } from '../share-lib/cancable-timeout'
import { addHistoryVisit, getHistoryVisit, getBytesInUse } from '../share-lib/chrome'
import { ItemHistory, Store } from "./store_v0"


const TIME_WRITE = 10 * 1000
const TIME_SAVESTORE = 20 * 1000


const tempStoreHistoryVisit = new Store()
const awaitTimeoutTabUpdate = new CancableTimeout<ItemHistory>(TIME_WRITE, false)



awaitTimeoutTabUpdate.onChange((pending, payload) => {
  // console.log('push', h)
  if (pending === true || !payload) return
  if (payload.url.startsWith('chrome')) return

  tempStoreHistoryVisit.push(payload)
})


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'history_visit_isActive') {
    if (msg.payload) {
      tempStoreHistoryVisit.continue()
    } else {
      tempStoreHistoryVisit.pause()
    }
    sendResponse('ok')
  }
})


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
  }, TIME_SAVESTORE)
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


// переключение активных вкладок
chrome.tabs.onActivated.addListener(activeInfo => {
  // console.log('onActivated', {activeInfo});
  
  chrome.tabs.get(activeInfo.tabId, tab => {
    // console.log('onActivated', {tab});
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return
    awaitTimeoutTabUpdate.update({ title: tab.title, url: tab.url })
  })
})

// обновление вкладки
// в том числе переход по ссылкам в рамках одной вкладки
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('onUpdated', {changeInfo, tab});
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return
  awaitTimeoutTabUpdate.update({ title: tab.title, url: tab.url })
})


// закрытие вкладки
chrome.windows.onRemoved.addListener(windowId => {
  // close window
  tempStoreHistoryVisit.closeLastSession()
  save()
})