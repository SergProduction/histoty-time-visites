import { createStore, createEvent, forward, Event } from 'effector'


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