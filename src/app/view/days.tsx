import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import DT from 'date-template'
import {
  ProgressBar,
  Intent,
  Button,
  ButtonGroup,
  Alert
} from '@blueprintjs/core'

import { $history } from '../store/main'
import { getDaysTotalTime, ItemHistoryDay } from '../../share-lib/getDaysTotalTime'
import { timeFormater } from '../../share-lib/pure'


export function Days() {
  const history = useStore($history)
  const [historyDays, setHistoryDays] = useState<ItemHistoryDay[]>([])

  useEffect(() => {
    const daysTotalTime = getDaysTotalTime(history).reverse()
    setHistoryDays(daysTotalTime)
  }, [history])

  return (
    <DivStyle>
      {historyDays.map(histDay => (
        <div className='day-block'>
          <div className='day-head'>
            <p>{DT('%0D/%0M/%Y', histDay.day)}</p>
          </div>
          <div className='day-body'>
            {histDay.hosts.map(histHost => (
              <div className='host'>
                {histHost.icon && <img src={histHost.icon} alt="icon" className='icon' />}
                <p>{histHost.host}</p>
                <p>{timeFormater(histHost.totalTime)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DivStyle>
  )
}

const DivStyle = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(4, auto);
  width: 100%;
  gap: 8px;
  margin: 8px;

  .day-block {
    border: 1px solid #ccc;
    height: 100%;
  }

  .day-head {
    background-color: #ccc;
    text-align: center;
  }

  .day-body {
    padding: 8px;
  }

  .host {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & p {
      margin: 2px 6px;
    }
  }

  .icon {
    width: 16px;
    height: 16px;
    background: #eee;
  }
`
