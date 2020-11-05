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

import { timeFormater } from '../lib'
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


const Table = styled.table`
  & td:nth-child(1) {
    min-width: 155px;
  }
`

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
    <Table className={classnames(Classes.HTML_TABLE, Classes.SMALL)}>
      <thead>
        <tr>
          <td>
            <ButtonGroup>
              <Button onClick={() => toggleSortByStartTime()}>sort by visite</Button>
              <Button onClick={() => toggleSortByUrl()}>sort by url</Button>
              <Button onClick={() => toggleSortByTotalTime()}>sort by total time</Button>
              <Button onClick={() => $historyPagination.prevPage()}>prev</Button>
              <Button disabled>{page}</Button>
              <Button disabled>{maxPage}</Button>
              <Button onClick={() => $historyPagination.nextPage()}>next</Button>
            </ButtonGroup>
          </td>
          <td></td>
          <td></td>
          <td>
            <DateRangeInput
              singleMonthOnly
              closeOnSelection
              formatDate={date => date.toLocaleString()}
              onChange={handleRangeChange}
              parseDate={str => new Date(str)}
              value={[startDate, endDate]}
            />
            <Button onClick={() => cancelAllFilters()}>reset filters</Button>
          </td>
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
          {history.map((h, i) => (
            <tr key={i + h.url}>
              <td>{DT('%0h:%0m:%0s %0D/%0M/%Y', h.start)}</td>
              <td>{timeFormater((h.end || 0) - h.start)}</td>
              <td>{h.title}</td>
              <td><a target="_blank" href={h.url}>{h.url}</a></td>
            </tr>
          ))}
        </React.Fragment>
      </tbody>
    </Table>
  )
}