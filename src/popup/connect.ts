import { ItemHistoryVisit } from "../share-lib/types";
import { setHistoryVisits } from "./store/main"


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log({ sender });

  if (msg.type === 'history_visit_isActive') {
    // setHistoryVisits(msg.payload)
    // sendResponse('ok')
  }
})


chrome.storage.onChanged.addListener((changes, namespace) => {
  if (!changes['historyVisit']) {
    console.warn('chrome.storage.onChanged does not "historyVisit"')
    console.info(changes, namespace);
    return
  }

  const storageChange = changes['historyVisit']

  const historyVisit = storageChange.newValue as ItemHistoryVisit[]

  console.log({ historyVisit });

  setHistoryVisits(historyVisit)
});
