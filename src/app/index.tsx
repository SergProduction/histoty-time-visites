import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useStore } from 'effector-react'
import {
  $history,
  $historyHost,
  toggleSortByHost,
  toggleSortByTime
} from './store'
import { timeFormater } from './lib'
import { fackTreeScheked } from './connect'




fackTreeScheked()


function History() {
  const maybeHistory = useStore($history)
  if (!maybeHistory) return null

  return (
    <React.Fragment>
      {maybeHistory.map((h, i) => (
        <tr key={i + h.url}>
          <td>{h.url}</td>
          <td>{timeFormater((h.end || 0) - h.start)}</td>
        </tr>
      ))}
    </React.Fragment>
  )
}

function HistoryHost() {
  const maybeHistoryHost = useStore($historyHost)
  if (!maybeHistoryHost) return null

  return (
    <React.Fragment>
      {maybeHistoryHost.map((h, i) => (
        <tr key={i + h.host}>
          <td>{h.host}</td>
          <td>{timeFormater(h.totalTime)}</td>
        </tr>
      ))}
    </React.Fragment>
  )
}


function Main() {
  const [type, setType] = useState(true)

  // TODO: реализовать сортировку списка с инпута по имени хоста
  // TODO: bug, если сперва нажать url -> sortByTime -> sortByHost -> host

  return (
    <div>
      <div>
        <button onClick={() => setType(t => !t)}>
          {type ? 'url' : 'host'}
        </button>
        <button onClick={() => toggleSortByHost()}>sortByHost</button>
        <button onClick={() => toggleSortByTime()}>sortByTime</button>
      </div>
      <table>
        <thead>
          <tr>
            <td>{type ? 'host' : 'url'}</td>
            <td>time h:m:s</td>
          </tr>
        </thead>
        <tbody>
          {type
            ? <HistoryHost />
            : <History />
          }
        </tbody>
      </table>
    </div>
  )
}

const rootHTML = document.getElementById('root') as HTMLElement

ReactDOM.render(<Main />, rootHTML)

