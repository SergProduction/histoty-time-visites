import { groupBy, sum } from "../../share-lib/pure"
import { ItemHistoryVisit } from "../../share-lib/types"
import { log } from "../log"


// Временное хранилище, чтоб не тригерить по пустякам стор хрома
export class TempStore {
  state: ItemHistoryVisit[]
  maxCount: number
  minTotalTime: number
  listeners: Array<(item: ItemHistoryVisit[]) => void>


  constructor(params: { maxCount: number, minTotalTime: number }) {
    this.state = []
    this.maxCount = params.maxCount
    this.minTotalTime = params.minTotalTime
    this.listeners = []
  }

  push(itemHist: ItemHistoryVisit) {
    this.state.push(itemHist)
    log('TempStore.push', this.state);
    this._checkLimit()
  }

  getAndClear() {
    const itemsCollapsed = this._getCollapsedState()
    this.state = []
    return itemsCollapsed
  }

  _checkLimit() {
    if (this.state.length < this.maxCount) {
      return
    }

    const itemsCollapsed = this._getCollapsedState()
    this.listeners.map(cb => {
      cb(itemsCollapsed)
    })
    this.state = []
  }

  // подписываемся на завершения сессии
  onSave(cb: (item: ItemHistoryVisit[]) => void) {
    this.listeners.push(cb)
    return () => {
      this.listeners = this.listeners.filter(x => x !== cb)
    }
  }

  /**
    Объединяем одинаковые урлы,
    суммируем время одинаковых
    оставляем первый, только с временем всех одинаковых
  */
  _getCollapsedState() {
    const itemsFull = this.state.map(x => ({
      ...x,
      totalTime: x.end - x.start,
    }))

    const itemsFullUrl = groupBy(itemsFull, 'url')

    const itemsCollapsed = Object.entries(itemsFullUrl)
      .map<ItemHistoryVisit>(([url, items]) => {
        const itemsSorted = items.sort((a, b) => a.start - b.start)
        const firstItem = itemsSorted[0]
        const totalTime = sum(itemsSorted.map(x => x.totalTime))
        return {
          url,
          title: firstItem.title,
          icon: firstItem.icon,
          start: firstItem.start,
          end: firstItem.start + totalTime
        }
      })

    return itemsCollapsed.filter(x => (x.end - x.start) > this.minTotalTime)
  }

}
