import { createStore, createEvent, forward } from 'effector'
import { groupBy, sum, sortByProp } from '../../share-lib/pure'
import { createToggleEvent } from './effector-lib'

import { $history } from './main'
import { historyMapGroupByHost } from '../../share-lib/history-map'


const _sortByTotalTimeHandler = sortByProp('totalTime')

export const [toggleSortByTotalTime, _sortByTotalTime] = createToggleEvent()

export const $historyHost = $history.map(s => historyMapGroupByHost(s))
  .on(_sortByTotalTime, (s, p) => _sortByTotalTimeHandler(s, p))



