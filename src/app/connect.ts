import { ItemHistoryVisit } from '../core/types'
import { setBytesInUsed } from './store/storage-size'
import { setHistory } from './store/main'





type RequestMessage = {
  type: 'historyVisit'
  payload: {
    historyVisit: ItemHistoryVisit[],
    bytesInUse: number,
  }
}

chrome.runtime.onMessage.addListener((request: RequestMessage, sender, sendResponse) => {
  if (request.type == "historyVisit" && sender.tab === undefined) {
    // console.log(request.payload)
    setHistory(request.payload.historyVisit)
    setBytesInUsed(request.payload.bytesInUse)
    sendResponse({type: "ok"})
  }
})

export const save = () => {

}

export const fackTreeScheked = () => 0