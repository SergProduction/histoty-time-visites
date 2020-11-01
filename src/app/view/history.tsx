import React, { useEffect } from 'react'
import { useStore } from 'effector-react'

import classnames from 'classnames'
import styled from 'styled-components'
import DT from 'date-template'
import {
  Classes,
  Button,
  ButtonGroup,
} from '@blueprintjs/core'


import { timeFormater } from '../lib'
import {
  $history,
  sortByStartTime,
  toggleSortByStartTime,
  toggleSortByUrl,
  toggleSortByTotalTime,
  $pending
} from '../store/main'


const Table = styled.table`
  & td:nth-child(1) {
    min-width: 155px;
  }
`

export function HistoryTimeVisite() {
  const maybeHistory = useStore($history)
  const pending = useStore($pending)
  
  useEffect(() => {
    if (pending === true) return
    sortByStartTime(true)
  }, [pending])

  if (!maybeHistory) return null

  return (
    <Table className={classnames(Classes.HTML_TABLE, Classes.SMALL)}>
      <thead>
        <tr>
          <td>
            <ButtonGroup>
              <Button onClick={() => toggleSortByStartTime()}>sort by visite</Button>
              <Button onClick={() => toggleSortByUrl()}>sort by url</Button>
              <Button onClick={() => toggleSortByTotalTime()}>sort by total time</Button>
            </ButtonGroup>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>visite</td>
          <td>total time</td>
          <td>title</td>
          <td>url</td>
        </tr>
      </thead>
      <tbody>
        <React.Fragment>
          {maybeHistory.map((h, i) => (
            <tr key={i + h.url}>
              <td>{DT('%0h:%0m:%0s %0D/%0M/%Y', h.start)}</td>
              <td>{timeFormater((h.end || 0) - h.start)}</td>
              <td>{h.title}</td>
              <td>{h.url}</td>
            </tr>
          ))}
        </React.Fragment>
      </tbody>
    </Table>
  )
}