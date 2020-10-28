import { restore, createStore, createEvent, guard, forward } from 'effector'

import { ItemHistoryVisit } from '../core/types'
import { ItemHistory, ItemHistoryByHost } from './types'



// TODO: сделать избранное, чтоб добавлять домены, и следить за ними
// TODO: отсортировывать список по алфавиту, по времени посещения

/*
// отсортировать по урлу
t.filter(h => h.url.includes('nestjs'))
// получить время посещения одного айтема
t1 = t.map(h => h.end - h.start)
// получить общие время всех айтемов
t2 = t1.reduce((a, b) => a+b))
*/

const sum = (arr: number[]) => arr.reduce((a, b) => a + b)

const groupBy = <T extends { [k: string]: any }>(arr: T[], prop: string): { [k: string]: T[] } => arr
  .reduce<{ [k: string]: T[] }>((acc, it) => {
    const by = it[prop]
    if (acc[by] === undefined) {
      return { ...acc, [by]: [it] }
    } else {
      acc[by].push(it)
    }
    return acc
  }, {})


const mapTotalTimeByHost = (his: ItemHistory[]): ItemHistoryByHost[] => {
  const hisMapHost = groupBy(his, 'host')
  return Object.keys(hisMapHost).map(host => {
    const hisHost = hisMapHost[host]
    const totalTime = sum(hisHost.map(h => (h.end || 0) - h.start))
    return { host, totalTime: totalTime }
  })
}

const historySortByHost = <T extends { host: string }>(h: T[], dir?: boolean) => {
  if (dir === false) {
    return [...h].sort((a, b) => a.host > b.host ? 1 : -1)
  }
  return [...h].sort((a, b) => a.host < b.host ? 1 : -1)
}

const historyHostSortByTime = <T extends { totalTime: number }>(h: T[], dir?: boolean) => {
  if (dir === false) {
    return [...h].sort((a, b) => a.totalTime > b.totalTime ? 1 : -1)
  }
  return [...h].sort((a, b) => a.totalTime < b.totalTime ? 1 : -1)
}

export const setHistory = createEvent<ItemHistoryVisit[]>()
const setHistoryFull = setHistory.map<ItemHistory[]>(historyVisit => historyVisit.map(h => ({
  ...h,
  host: new URL(h.url).host,
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

export const $history = createStore<null | ItemHistory[]>(null)
  .on(setHistoryFull, (s, p) => p)
  .on(sortByHost, (s, p) => !s ? s : historySortByHost(s, p))
  .on(sortByTime, (s, p) => !s ? s : historyHostSortByTime(s, p))


export const $historyHost = createStore<null | ItemHistoryByHost[]>(null)
  .on(setHistoryFull, (s, p) => mapTotalTimeByHost(p))
  .on(sortByHost, (s, p) => !s ? s : historySortByHost(s, p))
  .on(sortByTime, (s, p) => !s ? s : historyHostSortByTime(s, p))

