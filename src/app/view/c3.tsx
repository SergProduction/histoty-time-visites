import React, { useRef, useLayoutEffect } from 'react'
import { useStore } from 'effector-react'
import c3 from 'c3'
import DT from 'date-template'

import { groupBy, timeFormater } from '../../share-lib/pure'

import {
  $pending,
  $historyPagination
} from '../store/main'


type ChartData = [string, ...Array<null | number>]

function splitMiddle<T>(data: T[], countChunks: number): T[][] {
  const chunkLength = Math.floor(data.length / countChunks)
  const chunks = []
  for (let i=0; i<countChunks; i++) {
    const chunk = data.slice(
      chunkLength * i,
      chunkLength * (i+1)
    )
    chunks.push(chunk)
  }
  
  return chunks
}

const createChart = (tagId: string, data: ChartData[], xAxisData: string[]) => c3.generate({
  bindto: `#${tagId}`,
  data: {
    columns: data,
  },
  axis: {
    x: {
      type: 'category',
      categories: xAxisData
    },
    y: {
      tick: {
        format: x => timeFormater(x)
      }
    }
  }
})


export function Chart() {
  const maybeDiv = useRef(null)

  const pending = useStore($pending)
  const history = useStore($historyPagination.$state)

  useLayoutEffect(() => {
    if (pending) return

    const historyWithId = history.chunk.map((x, i) => ({ ...x, id: i })).reverse()

    const hosts = groupBy(historyWithId, 'host')

    const data = Object.entries(hosts).map(([host, hist]): ChartData => {
      const ids = new Map(hist.map(x => ([x.id, x])))
      return [
        host,
        ...historyWithId.map(x => ids.has(x.id) ? ids.get(x.id).totalTime : null)
      ]
    })


    const xAxisDataDate = historyWithId.map(x => DT('%h:%0m:%0s', x.start))

    const xAxisDataDateChunks = splitMiddle(xAxisDataDate, 3)

    const dataD = []

    data.forEach(x => {
      const [host, ...d] = x
      const chunks = splitMiddle(d, 3)
      const chunksWithNames = chunks.map(c => ([host, ...c]))
      
      chunksWithNames.forEach((c, i) => {
        if (Array.isArray(dataD[i])) {
          dataD[i].push(c)
        }
        else {
          dataD[i] = [c]
        }
      })
      return chunksWithNames
    })

    console.log(dataD, xAxisDataDateChunks)

    dataD.forEach((d, i) => {
      createChart(`chart${i+1}`, d, xAxisDataDateChunks[i])
    })
  }, [])

  return (
    <div>
      <div id="chart1" />
      <div id="chart2" />
      <div id="chart3" />
    </div>
  )
}
