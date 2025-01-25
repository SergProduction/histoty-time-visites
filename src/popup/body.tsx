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
import { $historyHost } from './store/main'
import { getHostByUrl, timeFormater } from '../share-lib/pure'
import { ItemHistoryByHost } from '../share-lib/types'



export function Body() {
  const [currentHost, setCurrentHost] = useState<ItemHistoryByHost>()
  const historyHost = useStore($historyHost)

  const openApp = () => {
    const pathToAppHtml = chrome.runtime.getURL("/app.html")

    chrome.tabs.create({
      url: pathToAppHtml
    });
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab.url) {
        const currentHost = getHostByUrl(tab.url)
        const currentHostHistory = historyHost.find(x => x.host === currentHost)
        if (currentHostHistory) {
          setCurrentHost(currentHostHistory)
        }
      }
    });
  })

  return (
    <BodyStyle>
      {currentHost && (
        <div>
          <p>
            текущий домен {currentHost.host}
          </p>
          <p>
            общее время домена: {timeFormater(currentHost.totalTime)}
          </p>
        </div>
      )}
      <Button onClick={openApp}>
        Открыть
      </Button>
    </BodyStyle>
  )
}



const BodyStyle = styled.div`
  padding: 12px;
  max-width: 500px;

  .last-visit {
    
  }
`