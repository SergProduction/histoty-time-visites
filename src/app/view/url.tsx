import React from 'react'
import { useStore } from 'effector-react'

import { Classes, Button } from '@blueprintjs/core'
import classnames from 'classnames'

import { timeFormater } from '../lib'
import {
  $history,
  toggleSortByTime,
  toggleSortByHost,
} from '../store'


export function HistoryUrl() {
  const maybeHistory = useStore($history)
  if (!maybeHistory) return null

  return (
    <table className={classnames(Classes.HTML_TABLE, Classes.SMALL)}>
      <thead>
        <tr>
          <td>
            <Button onClick={() => toggleSortByHost()}>sort by time</Button>
          </td>
          <td></td>
          <td>
            <Button onClick={() => toggleSortByTime()}>sort by time</Button>
          </td>
        </tr>
        <tr>
          <td>title</td>
          <td>url</td>
          <td>time</td>
        </tr>
      </thead>
      <tbody>
        <React.Fragment>
          {maybeHistory.map((h, i) => (
            <tr key={i + h.url}>
              <td>{h.title}</td>
              <td>{h.url}</td>
              <td>{timeFormater((h.end || 0) - h.start)}</td>
            </tr>
          ))}
        </React.Fragment>
      </tbody>
    </table>
  )
}