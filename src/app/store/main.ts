import { createStore, createEvent, guard, restore, combine } from 'effector'

import { ItemHistoryVisit } from '../../core/types'
import { ItemHistory } from '../types'
import { sortByProp } from '../lib'
import { createToggleEvent } from './lib'





// TODO: сделать избранное, чтоб добавлять домены, и следить за ними
// TODO: отсортировывать список по алфавиту, по времени посещения
// TODO: когда будет свой готовый сервис, можно предоставлять апи для платных подписчиков
// TODO: сделать выборку в промежутке дат
// TODO: сделать пагинацию


const getHostByUrl = (url: string): string => {
  const host = new URL(url).host
  return host.includes('www')
    ? host.slice(4)
    : host
}


export const _sortByUrlHandler = sortByProp('url')
export const _sortByTotalTimeHandler = sortByProp('totalTime')
const _sortByStartTimeHandler = sortByProp('start')


export const setHistory = createEvent<ItemHistoryVisit[]>()

export const _setHistoryFull = setHistory
.map(x => _sortByStartTimeHandler(x))
.map<ItemHistory[]>(historyVisit => historyVisit.map(h => ({
  ...h,
  host: getHostByUrl(h.url),
  totalTime: (h.end || 0) - h.start
})))


export const [toggleSortByUrl, _sortByUrl] = createToggleEvent()
export const [toggleSortByTotalTime, _sortByTotalTime] = createToggleEvent()
export const [toggleSortByStartTime, sortByStartTime] = createToggleEvent()

const setPending = createEvent<boolean>()
export const $pending = restore<boolean>(setPending, true)

export const $history = createStore<null | ItemHistory[]>(null)
  .on(_setHistoryFull, (s, p) => p)
  .on(_sortByUrl, (s, p) => !s ? s : _sortByUrlHandler(s, p))
  .on(_sortByTotalTime, (s, p) => !s ? s : _sortByTotalTimeHandler(s, p))
  .on(sortByStartTime, (s, p) => !s ? s : _sortByStartTimeHandler(s, p))


// checkout pending only to false
guard({
  source: $history.updates,
  filter: combine([$history, $pending]).map(([h, p]) => h !== null && p === true),
  target: setPending.prepend(() => false)
})
