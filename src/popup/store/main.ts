import { restore, createEvent, createStore } from 'effector'
import { ItemHistoryFull, ItemHistoryVisit } from '../../share-lib/types'
import { getHostByUrl } from '../../share-lib/pure'
import { historyMapGroupByHost } from '../../share-lib/history-map'


// --------- main


export const setHistoryVisits = createEvent<ItemHistoryVisit[]>()

const setHistoryFull = setHistoryVisits.map<ItemHistoryFull[]>(historyVisit => historyVisit.map(h => ({
  ...h,
  host: getHostByUrl(h.url),
  totalTime: (h.end || 0) - h.start
})))


export const $history = createStore<ItemHistoryFull[]>([])
  .on(setHistoryFull, (_, x) => x)


// ----------- map


export const $historyHost = $history.map(s => historyMapGroupByHost(s))
