import { addHistoryVisit } from "../share-lib/chrome"
import { log } from "./log"
// import { LastItemHistoryState, TempStore } from "./store/last-time"
import { TimeTrack } from "./store/time-track"
import { TempStore } from "./store/temp"


const timeTrack = new TimeTrack()
const tempStore = new TempStore({ maxCount: 12, minTotalTime: 5000 })


// сохраняет из временного стора в хромовское,
// если переполненно временное
// или принудительно (force), не смотря на заполнение
function saveForce() {
  const lastState = tempStore.getAndClear()
  log('saveForce', lastState);
  addHistoryVisit(lastState)
}


// слушаем последнюю активную владку и сохраняем
timeTrack.onCloseLastSession((lastItemHistory) => {
  tempStore.push(lastItemHistory)
})

tempStore.onSave((history) => {
  log('save', history);
  addHistoryVisit(history)
})


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  log('chrome.runtime.onMessage', msg);

  // если пауза, то завершаем сессию
  if (msg.type === 'history_visit_isActive') {
    if (msg.isActive === false && timeTrack.state?.url === msg.historyItem.url) {
      timeTrack.closeLastSession(msg.historyItem.url)
      saveForce()
    }
    if (
      msg.isActive === true &&
      (timeTrack.state?.url === msg.historyItem.url || timeTrack.state === null)
    ) {
      timeTrack.push(msg.historyItem)
    }
  }
  // принудительно сохранение временных данных
  if (msg.type === 'history_visit_tempSave') {
    const maybeItemHistory = timeTrack.pop()
    if (maybeItemHistory) {
      tempStore.push(maybeItemHistory)
    }
    saveForce()
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
  // активируется даже при наведении на вкладку
  // log('onActivated', { activeInfo });
  chrome.tabs.get(activeInfo.tabId, tab => {
    log('chrome.tabs.get', { tab });
    if (tab.status !== "complete" || !tab.active || !tab.title || !tab.url) return

    timeTrack.push({
      title: tab.title,
      url: tab.url,
      icon: tab.favIconUrl,
    })
  })
})


// обновление вкладки
// в том числе переход по ссылкам в рамках одной вкладки
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  log('onUpdated', { changeInfo, tab });
  if (changeInfo.status !== "complete" || !tab.active || !tab.title || !tab.url) return

  timeTrack.push({
    title: tab.title,
    url: tab.url,
    icon: tab.favIconUrl,
  })
})


// close window
chrome.windows.onRemoved.addListener(windowId => {
  timeTrack.closeLastSession()
  saveForce()
})
