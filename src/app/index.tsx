import React from 'react'
import ReactDOM from 'react-dom'
import { restore, createStore, createEvent } from 'effector'
import { ItemHistoryVisit } from '../core/types'

type RequestMessage = {
  type: 'historyVisit'
  payload: ItemHistoryVisit[]
}

chrome.runtime.onMessage.addListener((request: RequestMessage, sender, sendResponse) => {
  if (request.type == "historyVisit" && sender.tab === undefined) {
    setHistoryVisit(request.payload)
    sendResponse({type: "ok"})
  }
})

const setHistoryVisit = createEvent<ItemHistoryVisit[]>()

const $historyVisit = createStore<null | ItemHistoryVisit[]>(null)
  .on(setHistoryVisit, (s, p) => p)



const rootHTML = document.getElementById('root') as HTMLElement

const Main = () => {
  return (
    <p>ES</p>
  )
}

ReactDOM.render(<Main />, rootHTML)

/*
// отсортировать по урлу
t.filter(h => h.url.includes('nestjs'))
// получить время посещения одного айтема
t1 = t.map(h => h.end - h.start)
// получить общие время всех айтемов
t2 = t1.reduce((a, b) => a+b))
*/

