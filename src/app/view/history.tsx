import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'

import classnames from 'classnames'
import styled from 'styled-components'
import DT from 'date-template'
import {
  Classes,
  Button,
  ButtonGroup,
} from '@blueprintjs/core'
import { DateRangeInput, DateRange } from "@blueprintjs/datetime"

import { timeFormater } from '../../share-lib/pure'
import {
  $history,
  sortByStartTime,
  toggleSortByStartTime,
  toggleSortByUrl,
  toggleSortByTotalTime,
  $pending,
  $historyPagination,
  filterByVisitRangeDate,
  cancelAllFilters
} from '../store/main'
import { Image } from '../components/icon'


export function HistoryTimeVisite() {
  const pending = useStore($pending)

  const { chunk: history, page, maxPage } = useStore($historyPagination.$state)

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const handleRangeChange = (d: DateRange) => {
    const [from, to] = d
    if (from !== null && to !== null) {
      filterByVisitRangeDate({
        startDate: from.valueOf(),
        endDate: to.valueOf()
      })
    }
    if (from !== null) setStartDate(from)
    if (to !== null) setEndDate(to)
  }


  useEffect(() => {
    if (pending === true) return
    sortByStartTime(true)
  }, [pending])

  if (pending === true) return null

  return (
    <DivStyle>
      <div className='paginationWrap'>
        <ButtonGroup>
          <Button onClick={() => $historyPagination.prevPage()}>prev</Button>
          <Button disabled>{page}</Button>
          <Button disabled>{maxPage}</Button>
          <Button onClick={() => $historyPagination.nextPage()}>next</Button>
          <Button onClick={() => cancelAllFilters()}>reset filters</Button>

          {/* 
        <DateRangeInput
          singleMonthOnly
          closeOnSelection
          formatDate={date => date.toLocaleString()}
          onChange={handleRangeChange}
          parseDate={str => new Date(str)}
          value={[startDate, endDate]}
        />
        */}
        </ButtonGroup>
      </div>
      <table className={classnames(Classes.HTML_TABLE, Classes.COMPACT)}>
        <thead>
          <tr>
            <td></td>
            <td>
              <Button onClick={() => toggleSortByStartTime()}>visit</Button>
            </td>
            <td>
              <Button onClick={() => toggleSortByTotalTime()}>total time</Button>
            </td>
            <td>title</td>
            <td>
              <Button onClick={() => toggleSortByUrl()}>url</Button>
            </td>
          </tr>
        </thead>
        <tbody>
          <React.Fragment>
            {history.map((h, i) => (
              <tr key={i + h.url}>
                <td><Image href={h.icon} /></td>
                <td>{DT('%0D/%0M/%Y %0h:%0m:%0s', h.start)}</td>
                <td>{timeFormater((h.end || 0) - h.start)}</td>
                <td>{h.title}</td>
                <td><a target="_blank" href={h.url}>{h.url}</a></td>
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

  .paginationWrap {
    padding: 10px;
  }
`