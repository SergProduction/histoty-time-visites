import { ItemHistoryVisit } from '../core/types'
import { setHistoryVisit } from './store'


type RequestMessage = {
  type: 'historyVisit'
  payload: ItemHistoryVisit[]
}

chrome.runtime.onMessage.addListener((request: RequestMessage, sender, sendResponse) => {
  if (request.type == "historyVisit" && sender.tab === undefined) {
    
    setHistoryVisit(request.payload)
    
    sendResponse({type: "ok"})
  }
})

export const fackTreeScheked = () => 0