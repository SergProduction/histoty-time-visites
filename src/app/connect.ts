import { ItemHistoryVisit } from '../share-lib/types'
import { setHistory } from './store/main'


chrome.storage.onChanged.addListener((changes, namespace) => {
  if (!changes['historyVisit']) {
    console.warn('chrome.storage.onChanged does not "historyVisit"')
    console.info(changes, namespace);
    return
  }

  const storageChange = changes['historyVisit']

  const historyVisit = storageChange.newValue as ItemHistoryVisit[]

  setHistory(historyVisit)
});
