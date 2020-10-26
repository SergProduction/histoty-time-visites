import { restore, createStore, createEvent } from 'effector'

import { ItemHistoryVisit } from '../core/types'


// TODO: сделать избранное, чтоб добавлять домены, и следить за ними
// TODO: отсортировывать список по (хосту) алфавиту, по времени посещения

/*
// отсортировать по урлу
t.filter(h => h.url.includes('nestjs'))
// получить время посещения одного айтема
t1 = t.map(h => h.end - h.start)
// получить общие время всех айтемов
t2 = t1.reduce((a, b) => a+b))
*/

const sum = (arr: number[]) => arr.reduce((a, b) => a+b)

const groupBy = <T extends {[k:string]: any}>(arr: T[], prop: string): {[k:string]: T[]} => arr
.reduce<{[k:string]: T[]}>((acc, it) => {
  const by = it[prop]
  if (acc[by] === undefined) {
    return { ...acc, [by]: [it] }
  } else {
    acc[by].push(it)
  }
  return acc
}, {})



const mapHisToByHost = (his: ItemHistoryVisit[]) => {
  const hisH = his.map(h => {
    try {
      const host = new URL(h.url).host
      return {...h, host }
    } catch(e) {
      console.warn('some items without url')
      console.log(h)
      return {...h, host: 'unknow' }
    }
  })
  return groupBy(hisH, 'host')
}

const mapTotalTimeByHost = (his: ItemHistoryVisit[]) => {
  const s = mapHisToByHost(his)
  console.log({s})
  return Object.keys(s).map(host => {
    const hisHost = s[host]
    const totalTime = sum(hisHost.map(h => (h.end || 0) - h.start))
    return { host, totalTime: totalTime }
  })
}

export const setHistoryVisit = createEvent<ItemHistoryVisit[]>()


export const $historyVisit = createStore<null | ItemHistoryVisit[]>(null)
  .on(setHistoryVisit, (s, p) => p)


export const $totalTimeByHost = $historyVisit.map(s => s ? mapTotalTimeByHost(s) : null)