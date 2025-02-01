import React, { useState } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import {
  ProgressBar,
  Intent,
  Button,
  ButtonGroup,
} from '@blueprintjs/core'

import {
  $bytesInUsed
} from '../store/storage-size'

const MAXSIZE_CHROMESTORAGE = 5242880


export function UserStoreSize() {
  const bytesInUsed = useStore($bytesInUsed)

  const clearUserStore = () => {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ historyVisit: [] })
    })
  }

  return (
    <DivStyle>

      <ButtonGroup>
        <Button onClick={clearUserStore}>
          Очистить
        </Button>
        <Button onClick={clearUserStore} disabled>
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
    </DivStyle>
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