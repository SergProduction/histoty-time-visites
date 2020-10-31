import { restore, createStore, createEvent, guard, forward } from 'effector'

import { ItemHistoryVisit } from '../core/types'
import { ItemHistory, ItemHistoryByHost } from './types'
import { groupBy, sortByProp, sum } from './lib'




// TODO: сделать избранное, чтоб добавлять домены, и следить за ними
// TODO: отсортировывать список по алфавиту, по времени посещения


const getHostByUrl = (url: string): string => {
  const host = new URL(url).host
  return host.includes('www')
    ? host.slice(4)
    : host
}


const mapTotalTimeByHost = (his: ItemHistory[]): ItemHistoryByHost[] => {
  const hisMapHost = groupBy(his, 'host')
  return Object.keys(hisMapHost).map(host => {
    const hisHost = hisMapHost[host]
    const totalTime = sum(hisHost.map(h => (h.end || 0) - h.start))
    return { host, totalTime: totalTime }
  })
}


export const setBytesInUsed = createEvent<number>()

export const $bytesInUsed = restore(setBytesInUsed, 0)


export const setHistory = createEvent<ItemHistoryVisit[]>()
const setHistoryFull = setHistory.map<ItemHistory[]>(historyVisit => historyVisit.map(h => ({
  ...h,
  host: getHostByUrl(h.url),
  totalTime: (h.end || 0) - h.start
})))


const sortByHost = createEvent<boolean>()
const sortByTime = createEvent<boolean>()

export const toggleSortByHost = createEvent()
const $sortByHost = createStore(true).on(toggleSortByHost, s => !s)

export const toggleSortByTime = createEvent()
const $sortByTime = createStore(true).on(toggleSortByTime, s => !s)

forward({
  from: $sortByHost,
  to: sortByHost
})


forward({
  from: $sortByTime,
  to: sortByTime
})

const sortByHostHandler = sortByProp('host')
const sortByTimeHandler = sortByProp('totalTime')


export const $history = createStore<null | ItemHistory[]>(null)
  .on(setHistoryFull, (s, p) => p)
  .on(sortByHost, (s, p) => !s ? s : sortByHostHandler(s, p))
  .on(sortByTime, (s, p) => !s ? s : sortByTimeHandler(s, p))


export const $historyHost = createStore<null | ItemHistoryByHost[]>(null)
  .on(setHistoryFull, (s, p) => mapTotalTimeByHost(p))
  .on(sortByHost, (s, p) => !s ? s : sortByHostHandler(s, p))
  .on(sortByTime, (s, p) => !s ? s : sortByTimeHandler(s, p))

