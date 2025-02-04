import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import DT from 'date-template'

import { $history } from '../store/main'
import { getDaysTotalTime, ItemHistoryDay } from '../../share-lib/getDaysTotalTime'
import { timeFormater } from '../../share-lib/pure'
import { Image } from '../components/icon'


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
        <div className='day-block' key={histDay.day}>
          <div className='day-head'>
            <p>{DT('%0D/%0M/%Y', histDay.day)}</p>
          </div>
          <div className='day-body'>
            {histDay.hosts.slice(0, 10).map(histHost => (
              <div className='host' key={histHost.host}>
                <Image href={histHost.icon} />
                <p className='fill'>{histHost.host}</p>
                <p>{timeFormater(histHost.totalTime)}</p>
              </div>
            ))}
            {histDay.hosts.length > 10 && (
              <div className='host'>
                <p className='fill cursive'>всего {histDay.hosts.length}</p>
              </div>
            )}
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

  p {
    margin: 0;
  }

  .day-block {
    border: 1px solid #ccc;
    height: 100%;
  }

  .day-head {
    background-color: #ccc;
    text-align: center;
    padding: 2px;
  }

  .day-body {
    padding: 8px;
  }

  .host {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding-bottom: 2px;
    margin-bottom: 2px;

    & p {
      margin: 2px 6px;
    }

    &:last-child {
      border: none;
    }
  }

  .fill {
    width: 100%;
  }

  .cursive {
    text-align: center;
    font-style: italic;
  }

  .icon {
    width: 16px;
    height: 16px;
    background: #eee;
    margin-right: 8px;
  }
`
