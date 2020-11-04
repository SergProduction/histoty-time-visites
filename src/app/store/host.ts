import { createStore, createEvent, forward } from 'effector'

import { ItemHistory, ItemHistoryByHost } from '../types'
import { groupBy, sum, sortByProp } from '../lib'
import { createToggleEvent } from './lib'

import {
  $history
} from './main'


const historyMapGroupByHost = (his: ItemHistory[]): ItemHistoryByHost[] => {
  const hisMapHost = groupBy(his, 'host')
  return Object.keys(hisMapHost).map(host => {
    const hisHost = hisMapHost[host]
    const totalTime = sum(hisHost.map(h => h.totalTime))
    return { host, totalTime: totalTime }
  })
}

const _sortByTotalTimeHandler = sortByProp('totalTime')

export const [toggleSortByTotalTime, _sortByTotalTime] = createToggleEvent()

export const $historyHost = $history.map(s => historyMapGroupByHost(s))
  .on(_sortByTotalTime, (s, p) => _sortByTotalTimeHandler(s, p))



