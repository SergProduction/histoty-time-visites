import { createStore, createEvent, forward, Event, Store } from 'effector'


export const createToggleEvent = (initState: boolean = true): [Event<void>, Event<boolean>] => {
  const toggle = createEvent()
  const $toggle = createStore(initState).on(toggle, s => !s)
  const toggleResult = createEvent<boolean>()

  forward({
    from: $toggle,
    to: toggleResult
  })

  return [toggle, toggleResult]
}

export const createPagination = <T>(stor: Store<T[]>, maxCountInOnePage: number) => {
  type P = {
    page: number
    maxPage: number
    data: T[],
    chunk: T[],
  }
  
  const setPage = createEvent<number>()
  const nextPage = createEvent()
  const prevPage = createEvent()

  const $state = stor.map(x => ({
    page: 1,
    maxPage: Math.ceil(x.length / maxCountInOnePage),
    data: x,
    chunk: x.slice(0, maxCountInOnePage)
  }))

  $state
    .on(nextPage, (s) => s.maxPage === (s.page) ? s : ({
      ...s,
      page: s.page + 1,
      chunk: s.data.slice(s.page * maxCountInOnePage, (s.page + 1) * maxCountInOnePage)
    }))
    .on(prevPage, (s) => s.page === 1 ? s : ({
      ...s,
      page: s.page - 1,
      chunk: s.data.slice((s.page - 1) * maxCountInOnePage, s.page * maxCountInOnePage)
    }))
    .on(setPage, (s, p) => (p < 1 || p > s.maxPage) ? s : ({
      ...s,
      page: s.page - 1,
      chunk: s.data.slice((s.page - 1) * maxCountInOnePage, s.page * maxCountInOnePage)
    }))

  return {
    setPage,
    prevPage,
    nextPage,
    $state
  }
}