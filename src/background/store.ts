import { ItemHistoryVisit } from "../share-lib/types"

export type ItemHistory = { title: string, url: string }

// Временное хранилище, чтоб не тригерить по пустякам стор хрома
export class TempStore {
  state: ItemHistoryVisit[]
  maxCount: number

  constructor(maxCount: number) {
    this.state = []
    this.maxCount = maxCount
  }

  push(itemHist: ItemHistoryVisit) {
    this.state.push(itemHist)
  }

  // получить и сбросить стор
  // если он наполнился больше чем maxCount
  getAndClear(cb: (lastState: ItemHistoryVisit[]) => void, force?: boolean) {
    if (force === true || this.state.length >= this.maxCount) {
      const lastState = [...this.state]
      cb(lastState)
      this.state = []
    }
  }
}

// Последняя активная вкладка
// перезаписывается при добавлении новой и сохраняет старую
export class LastItemHistoryState {
  state: null | ItemHistoryVisit
  // подписчики завершения сессии
  listeners: Array<(item: ItemHistoryVisit) => void>
  // минимальное время существования сессии
  sessionMinTime: number


  constructor(sessionMinTime: number) {
    this.state = null
    this.listeners = []
    this.sessionMinTime = sessionMinTime
  }

  push(payload: ItemHistory) {
    // если новый урл, то завершаем старую сессию и начинаем новую
    if (this.state?.url !== payload.url) {
      this.closeLastSession()
      this.state = {
        url: payload.url,
        title: payload.title,
        start: Date.now(),
        end: null
      }
    }
    // если урл тот же, обновляем время завершения
    else if (this.state?.url === payload.url) {
      this.state = {
        ...this.state,
        end: Date.now(),
      }
    }
  }

  // завершает сессию, и вызывает всех слушателей,
  // если время продолжительности сессию больше указанной (sessionMinTime)
  closeLastSession() {
    if (!this.state) return
    const lastState = {
      ...this.state,
      end: Date.now(),
    }
    this.listeners.map(cb => {
      if (lastState.end - lastState.start > this.sessionMinTime) {
        cb(lastState)
      }
    })
    this.state = null
  }

  // подписываемся на завершения сессии
  onCloseLastSession(cb: (item: ItemHistoryVisit) => void) {
    this.listeners.push(cb)
    return () => {
      this.listeners = this.listeners.filter(x => x !== cb)
    }
  }
}

