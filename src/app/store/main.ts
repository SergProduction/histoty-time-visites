import { createStore, createEvent, guard, restore, combine, sample } from 'effector'

import { ItemHistoryVisit } from '../../share-lib/types'
import { ItemHistoryFull } from '../../share-lib/types'
import { getHostByUrl, sortByProp } from '../../share-lib/pure'
import {
  createToggleEvent,
  createPagination,
} from './effector-lib'


// TODO: сделать избранное, чтоб добавлять домены, и следить за ними
// TODO: отсортировывать список по алфавиту, по времени посещения
// TODO: когда будет свой готовый сервис, можно предоставлять апи для платных подписчиков
// TODO: сделать выборку в промежутке дат
// TODO: сделать пагинацию


export const _sortByUrlHandler = sortByProp('url')
export const _sortByTotalTimeHandler = sortByProp('totalTime')
const _sortByStartTimeHandler = sortByProp('start')


export const setHistory = createEvent<ItemHistoryVisit[]>()

const _setHistoryFull = setHistory
  .map(x => _sortByStartTimeHandler(x))
  .map<ItemHistoryFull[]>(historyVisit => historyVisit.map(h => ({
    ...h,
    host: getHostByUrl(h.url),
    totalTime: (h.end || 0) - h.start
  })))


export const $history = createStore<ItemHistoryFull[]>([])
  .on(_setHistoryFull, (s, p) => p)

// ------ historyFiltred ------

export const [toggleSortByUrl, _sortByUrl] = createToggleEvent()
export const [toggleSortByTotalTime, _sortByTotalTime] = createToggleEvent()
export const [toggleSortByStartTime, sortByStartTime] = createToggleEvent()

const setPending = createEvent<boolean>()
export const $pending = restore<boolean>(setPending, true)

const filterByUrl = createEvent<string>()
export const filterByVisitRangeDate = createEvent<{ startDate: number, endDate: number }>()
export const cancelAllFilters = createEvent()


const $historyFiltred = $history.map(x => x)
  .on(_sortByUrl, (s, p) => _sortByUrlHandler(s, p))
  .on(_sortByTotalTime, (s, p) => _sortByTotalTimeHandler(s, p))
  .on(sortByStartTime, (s, p) => _sortByStartTimeHandler(s, p))
  .on(filterByVisitRangeDate, (s, p) => s.filter(h => h.end !== null && h.start > p.startDate && h.end < p.endDate))
  .on(filterByUrl, (s, p) => s.filter(h => h.url.includes(p)))

sample({
  source: $history,
  clock: cancelAllFilters,
  target: $historyFiltred
})

// checkout pending only to false
guard({
  source: $history.updates,
  filter: combine([$history, $pending]).map(([h, p]) => h.length > 0 && p === true),
  target: setPending.prepend(() => false)
})

export const $historyPagination = createPagination($historyFiltred, 100)

