import React from 'react'
import ReactDOM from 'react-dom'
import { useStore } from 'effector-react'
import { $historyVisit } from './store'








const Main = () => {
  const maybeHistoryVisit = useStore($historyVisit)
  
  if (!maybeHistoryVisit) return null
  
  return (
    <p>ES</p>
  )
}

const rootHTML = document.getElementById('root') as HTMLElement

ReactDOM.render(<Main />, rootHTML)


// TODO: сделать избранное, чтоб добавлять домены, и следить за ними

/*
// отсортировать по урлу
t.filter(h => h.url.includes('nestjs'))
// получить время посещения одного айтема
t1 = t.map(h => h.end - h.start)
// получить общие время всех айтемов
t2 = t1.reduce((a, b) => a+b))
*/

