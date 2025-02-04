import { ItemHistoryVisit } from "../../share-lib/types"
import { urlParseRegExp } from "../../share-lib/url-parse"
import { log } from "../log"

type ItemHistory = { title: string, url: string, icon?: string }

type ItemHistoryVisitTime = Omit<ItemHistoryVisit, 'end'> & { end: null | number }

// Последняя активная вкладка
// перезаписывается при добавлении новой и сохраняет старую
export class TimeTrack {
  state: null | ItemHistoryVisitTime
  // подписчики завершения сессии
  listeners: Array<(item: ItemHistoryVisit) => void>


  constructor() {
    this.state = null
    this.listeners = []
  }

  push(payload: ItemHistory) {
    log('LastItem.push', this.state, payload);

    if (payload.url.startsWith('chrome')) return

    if (!this.state) {
      this.state = {
        ...payload,
        start: Date.now(),
        end: null
      }
    }

    const { host: hostState } = urlParseRegExp(this.state.url)
    const { host: hostPayload } = urlParseRegExp(payload.url)

    // если домен тот же, обновляем время завершения
    // и обновляем новый урл, старый затираем новым
    if (hostState === hostPayload) {
      this.state = {
        ...this.state,
        ...payload,
        end: Date.now(),
      }
    }

    // если новый домен, то завершаем старую сессию и начинаем новую
    if (hostState !== hostPayload) {
      this.closeLastSession()
      this.state = {
        ...payload,
        start: Date.now(),
        end: null
      }
    }
  }


  /**
   * возвращает активную сессию и обновляет время
   * но не удаляет как обычный pop у массивов  
  */
  pop() {
    if (this.state === null) return null
    const currentSession = {
      ...this.state,
      end: Date.now(),
    }
    this.state = {
      ...this.state,
      start: Date.now(),
    }
    return currentSession
  }

  /**
    завершает сессию, и вызывает всех слушателей,
    Если передать url, то завершить сессию если он совпадет со стейтом
  */
  closeLastSession(maybeUrl?: string) {
    if (!this.state) return

    if (typeof maybeUrl === 'string') {
      const { host: hostState } = urlParseRegExp(this.state.url)
      const { host: hostPayload } = urlParseRegExp(maybeUrl)
      if (hostState !== hostPayload) return
    }

    const lastState = {
      ...this.state,
      end: Date.now(),
    }

    this.listeners.map(cb => {
      log('LastItem.closeLastSession', lastState);
      cb(lastState)
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
