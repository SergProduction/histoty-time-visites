
type CancableListener<T> = (pending: boolean, payload?: T) => void

export class CancableTimeout<T> {
  pending: boolean
  timer?: number | NodeJS.Timeout
  timeout: number
  listener: CancableListener<T>
  lastPayloadUpdate?: T
  constructor(timeout: number, initPending: boolean = true) {
    this.pending = initPending
    this.timer = undefined
    this.timeout = timeout
    this.listener = () => {}
    this.lastPayloadUpdate = undefined
  }

  onChange(listener: CancableListener<T>) {
    this.listener = listener
  }

  // пока вызывают апдейт чаще чем timeout, то onChagnge не сработает
  update(payload?: T) {
    this.lastPayloadUpdate = payload

    this.__updatePending(true)

    clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      this.__updatePending(false)
    }, this.timeout)
  }

  __updatePending(pending: boolean) {
    if (this.pending !== pending) {
      this.pending = pending
      this.listener(this.pending, this.lastPayloadUpdate)
    }
  }
}


/* 
export const fetchPOST = (obj: any) => fetch(
  'http://localhost:3000',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
})

export const fetchGET = (): Promise<ItemHistoryVisit> => fetch('http://localhost:3000').then(r => r.json())
*/
