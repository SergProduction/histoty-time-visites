import React from 'react'
import { useStore } from 'effector-react'

import styled from 'styled-components'
import {
  Classes,
  Button,
  ButtonGroup
} from '@blueprintjs/core'
import classnames from 'classnames'

import { timeFormater } from '../lib'

import { $historyHost, toggleSortByTotalTime } from '../store/host'
import { toggleSortByUrl } from '../store/main'



const Table = styled.table`
  &tr:nth-child(1) {
    background-color: #ff0;
    width: 500px;
  }
`

export function HistoryHost() {
  const maybeHistoryHost = useStore($historyHost)
  if (!maybeHistoryHost) return null

  return (
    <table className={classnames(Classes.HTML_TABLE, Classes.SMALL)}>
      <thead>
        <tr>
          <td>
            <ButtonGroup>
              <Button onClick={() => toggleSortByUrl()}>sort by host</Button>
              <Button onClick={() => toggleSortByTotalTime()}>sort by total time</Button>
            </ButtonGroup>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>host</td>
          <td>total time</td>
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
