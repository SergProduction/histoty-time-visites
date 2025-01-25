import { ItemHistoryVisit } from "../share-lib/types"

export type ItemHistory = { title: string, url: string }

export class Store {
  state: ItemHistoryVisit[]
  prev: null | ItemHistoryVisit
  isPause: boolean
  constructor() {
    this.prev = null
    this.state = []
    this.isPause = false
  }

  setPrev({ title, url }: ItemHistory) {
    this.prev = {
      title,
      url,
      start: Date.now(),
      end: null
    }
  }

  push(p: ItemHistory) {
    if (this.isPause) return

    if (this.prev !== null) {
      const prevComplite = { ...this.prev, end: Date.now() }
      this.state.push(prevComplite)
    }

    this.setPrev(p)
  }

  closeLastSession() {
    if (this.state.length > 0) {
      this.state[this.state.length - 1].end = Date.now()
    }
  }

  clear() {
    this.state = []
  }

  pause() {
    this.isPause = true
  }

  continue() {
    this.isPause = false
  }
}

