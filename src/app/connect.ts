import { ItemHistoryVisit } from '../core/types'
import { setHistory } from './store'


type RequestMessage = {
  type: 'historyVisit'
  payload: ItemHistoryVisit[]
}

chrome.runtime.onMessage.addListener((request: RequestMessage, sender, sendResponse) => {
  if (request.type == "historyVisit" && sender.tab === undefined) {
    
    setHistory(request.payload)
    
    sendResponse({type: "ok"})
  }
})

export const fackTreeScheked = () => 0