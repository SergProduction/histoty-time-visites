import { ItemHistoryVisit } from '../core/types'

type StorageAreaMyContent = { historyVisit: ItemHistoryVisit[] } & {[k: string]: any}

const isStorageAreaExistMyContent = (s: {[k: string]: any}): s is StorageAreaMyContent => {
  return Array.isArray(s.historyVisit)
}

export const getHistoryVisit = () => new Promise<ItemHistoryVisit[]>((res, rej) => {
  chrome.storage.local.get(items => {
    if (isStorageAreaExistMyContent(items)) {
      res(items.historyVisit)
    } else {
      rej(404)
    }
  })
})

export const addHistoryVisit = (historyVisit: ItemHistoryVisit[]) => new Promise((res) => {
  return getHistoryVisit()
    .then((oldHistoryVisit) => {
      chrome.storage.local.set(
        { historyVisit: [...oldHistoryVisit, ...historyVisit] },
        () => res()
      )
    })
})

export const getBytesInUse = () => new Promise<number>((res) => {
  // 5,242,880 max limit local storage
  chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
    res(bytesInUse)
  })
})


export const createTabAwaitComplite = (tabParams: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> => new Promise((res, rej) => {
  let tabIdcreated: undefined | number = undefined

  const handlerTabListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (tabId !== tabIdcreated) return
    if (changeInfo.status === "complete") {
      chrome.tabs.onUpdated.removeListener(handlerTabListener)
      res(tab)
    }
  }

  chrome.tabs.create(tabParams, (tab) => {
    tabIdcreated = tab.id
    chrome.tabs.onUpdated.addListener(handlerTabListener)
  })
})