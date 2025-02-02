import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import DT from 'date-template'
import { groupBy, sum, timeFormater } from '../../share-lib/pure'
import { ItemHistoryFull } from '../../share-lib/types'
import { getDayId } from '../../share-lib/day-id'


export function Days(props: { historyFull: ItemHistoryFull[] }) {
  const [daysTotalTime, setDaysTotalTime] = useState<Array<{ day: number, totalTime: number }>>([])

  useEffect(() => {
    setDaysTotalTime(getDaysTotalTime(props.historyFull))
  }, [props.historyFull])

  return (
    <BodyStyle>
      {daysTotalTime.map(x => (
        <div className='flex' key={x.day}>
          <p>{DT('%Dw %0D', x.day, middlewareDayName)}</p>
          <p>{timeFormater(x.totalTime)}</p>
        </div>
      ))}
    </BodyStyle>
  )
}

const BodyStyle = styled.div`
  padding: 12px 0;

  .flex {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #ccc;

    & p {
      margin: 0;
    }
  }
`

function getDaysTotalTime(hist: ItemHistoryFull[]) {
  const historyDayId = hist.map(x => ({
    ...x,
    dayId: getDayId(x.start)
  }))
  const historyDays = groupBy(historyDayId, 'dayId')
  const historyDaySorted = Object.entries(historyDays).sort(([dayA], [dayB]) => dayA - dayB)

  const historyDayTotalTime = historyDaySorted.map(([day, hist]) => ({
    day: parseInt(day),
    totalTime: sum(hist.map(x => x.totalTime))
  }))

  return historyDayTotalTime
}

function middlewareDayName(date: any) {
  const dayName = [
    'вс',
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб'
  ]
  date.Dw.value = dayName[date.Dw.value]
  return date
}
