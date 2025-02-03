import React from 'react'
import { useStore } from 'effector-react'

import styled from 'styled-components'
import {
  Classes,
  Button,
  ButtonGroup
} from '@blueprintjs/core'
import classnames from 'classnames'

import { timeFormater } from '../../share-lib/pure'

import { $historyHost, toggleSortByTotalTime } from '../store/host'
import { toggleSortByUrl } from '../store/main'
import { Image } from '../components/icon'



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
    <DivStyle>
      <table className={classnames(Classes.HTML_TABLE, Classes.COMPACT)}>
        <thead>
          <tr>
            <td></td>
            <td>
              <Button onClick={() => toggleSortByUrl()}>host</Button>
            </td>
            <td>
              <Button onClick={() => toggleSortByTotalTime()}>total time</Button>
            </td>
          </tr>
        </thead>
        <tbody>
          <React.Fragment>
            {maybeHistoryHost.map((h, i) => (
              <tr key={i + h.host}>
                <td>
                  <Image href={h.icon} />
                </td>
                <td>{h.host}</td>
                <td>{timeFormater(h.totalTime)}</td>
              </tr>
            ))}
          </React.Fragment>
        </tbody>
      </table>
    </DivStyle>
  )
}

const DivStyle = styled.div`
  white-space: nowrap;
`
