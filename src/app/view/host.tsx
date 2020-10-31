import React from 'react'
import { useStore } from 'effector-react'

import { Classes, Button } from '@blueprintjs/core'
import classnames from 'classnames'


import { timeFormater } from '../lib'
import {
  $historyHost,
  toggleSortByHost,
  toggleSortByTime
} from '../store'



export function HistoryHost() {
  const maybeHistoryHost = useStore($historyHost)
  if (!maybeHistoryHost) return null

  return (
    <table className={classnames(Classes.HTML_TABLE, Classes.SMALL)}>
      <thead>
        <tr>
          <td>
            <Button onClick={() => toggleSortByHost()}>sort by host</Button>
          </td>
          <td>
            <Button onClick={() => toggleSortByTime()}>sort by time</Button>
          </td>
        </tr>
        <tr>
          <td>host</td>
          <td>time</td>
        </tr>
      </thead>
      <tbody>
        <React.Fragment>
          {maybeHistoryHost.map((h, i) => (
            <tr key={i + h.host}>
              <td>{h.host}</td>
              <td>{timeFormater(h.totalTime)}</td>
            </tr>
          ))}
        </React.Fragment>
      </tbody>
    </table>
  )
}
