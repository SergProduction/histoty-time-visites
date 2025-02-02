import React, { useState } from 'react'
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

import {
  $bytesInUsed
} from '../store/storage-size'
import { $historyHost } from '../store/host'

const MAXSIZE_CHROMESTORAGE = 5242880


export function UserStoreSize() {
  const bytesInUsed = useStore($bytesInUsed)
  const historyHost = useStore($historyHost)

  const [isOpenClear, setOpenClear] = useState(false)
  const [isOpenCompress, setOpenCompress] = useState(false)

  const clearUserStore = () => {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ historyVisit: [] })
    })
  }

  const compressUserStore = () => {
    const historyHostCompress = historyHost.map(host => {
      const hostOrigin = host.history.length > 0
        ? new URL(host.history[0].url).host
        : `https://${host.host}`

      return {
        title: `${host.host} - history compress ${DT('%0D/%0M/%Y %0h:%0m:%0s')}`,
        url: hostOrigin,
        icon: host.icon,
        end: Date.now(),
        start: Date.now() - host.totalTime
      }
    })
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ historyVisit: historyHostCompress })
    })
  }

  return (
    <DivStyle>
      <ButtonGroup>
        <Button onClick={() => setOpenClear(true)}>
          Очистить
        </Button>
        <Button onClick={() => setOpenCompress(true)}>
          Cжать
        </Button>
      </ButtonGroup>

      <div className='progress'>
        <p className='size'>
          {(bytesInUsed / 1024).toFixed(2)} / {(MAXSIZE_CHROMESTORAGE / 1024).toFixed(2)} kb
        </p>
        <ProgressBar
          animate={false}
          intent={Intent.PRIMARY}
          value={bytesInUsed / MAXSIZE_CHROMESTORAGE}
        />
      </div>
      <Alert
        isOpen={isOpenCompress}
        onClose={() => setOpenCompress(false)}
        onConfirm={compressUserStore}
        cancelButtonText='Отмена'
        canEscapeKeyCancel
        canOutsideClickCancel
      >
        <p>
          Эта операция сожмет всю детальную историю страниц до доменов.
          Останется только статистика по доменам.
        </p>
      </Alert>
      <Alert
        isOpen={isOpenClear}
        onClose={(x) => setOpenClear(false)}
        onConfirm={clearUserStore}
        cancelButtonText='Отмена'
        canEscapeKeyCancel
        canOutsideClickCancel
      >
        <p>
          Удалить все данные и очистить хранилище?
        </p>
      </Alert>
    </DivStyle >
  )
}

const DivStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .size {
    font-size: 12px;
    margin: 2px 0;
  }

  .progress {
    width: 100px;
  }
`
