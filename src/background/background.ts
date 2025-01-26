import { addHistoryVisit } from "../share-lib/chrome"
import { LastItemHistoryState, TempStore } from "./store"



const lastItemHistoryState = new LastItemHistoryState(30 * 1000)
const tempStore = new TempStore(10)


// сохраняет из временного стора в хромовское,
// если переполненно временное
// или принудительно (force), не смотря на заполнение
function save(force?: boolean) {
  tempStore.getAndClear(lastState => {
    // console.log('save', { force, lastState });
    addHistoryVisit(lastState)
  }, force)
}


// слушаем последнюю активную владку и сохраняем
lastItemHistoryState.onCloseLastSession((lastItemHistory) => {
  tempStore.push(lastItemHistory)
  save()
})


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // если пауза, то завершаем сессию
  if (msg.type === 'history_visit_isActive' && msg.payload === false) {
    lastItemHistoryState.closeLastSession()
  }
  // принудительно сохранение временных данных
  if (msg.type === 'history_visit_tempSave') {
    const maybeItemHistory = lastItemHistoryState.pop()
    if (maybeItemHistory) {
      tempStore.push(maybeItemHistory)
    }
    save(true)
    // sendResponse('ok')
  }
})


chrome.runtime.onInstalled.addListener(() => {
  console.log('chrome.runtime.onInstalled')
})


chrome.runtime.onStartup.addListener(() => {
  console.log('chrome.runtime.onStartup')
})


// переключение активных вкладок
chrome.tabs.onActivated.addListener(activeInfo => {
  // console.log('onActivated', {activeInfo});
  chrome.tabs.get(activeInfo.tabId, tab => {
    // console.log('onActivated', {tab});
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return

    lastItemHistoryState.push({
      title: tab.title,
      url: tab.url,
      icon: tab.favIconUrl,
    })
  })
})


// обновление вкладки
// в том числе переход по ссылкам в рамках одной вкладки
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('onUpdated', {changeInfo, tab});
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return

  lastItemHistoryState.push({
    title: tab.title,
    url: tab.url,
    icon: tab.favIconUrl,
  })
})


// close window
chrome.windows.onRemoved.addListener(windowId => {
  lastItemHistoryState.closeLastSession()
  save(true)
})
