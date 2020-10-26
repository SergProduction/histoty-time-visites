import React from 'react'
import ReactDOM from 'react-dom'
import { useStore } from 'effector-react'
import { $historyVisit, $totalTimeByHost } from './store'
import { timeFormater } from './lib'
import { fackTreeScheked } from './connect'




fackTreeScheked()





const Main = () => {
  const maybeTotalTimeByHost = useStore($totalTimeByHost)
  
  console.log({maybeTotalTimeByHost})

  if (!maybeTotalTimeByHost) return null

  // TODO: реализовать сортировку списка с инпута по имени хоста

  return (
    <table>
      <thead>
        <tr>
          <td>host</td>
          <td>time h:m:s</td>
        </tr>
      </thead>
      <tbody>
      {maybeTotalTimeByHost.map(h => (
        <tr key={h.host}>
          <td>{h.host}</td>
          <td>{timeFormater(h.totalTime)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

const rootHTML = document.getElementById('root') as HTMLElement

ReactDOM.render(<Main />, rootHTML)

