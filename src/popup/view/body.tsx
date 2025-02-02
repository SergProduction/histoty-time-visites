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
import { $historyHost } from '../store/main'
import { getHostByUrl, groupBy, sum, timeFormater } from '../../share-lib/pure'
import { ItemHistoryByHost, ItemHistoryFull } from '../../share-lib/types'
import { getDayId } from '../../share-lib/day-id'
import { Days } from './days'


export function Body() {
  const [currentHost, setCurrentHost] = useState<ItemHistoryByHost>()
  const historyHost = useStore($historyHost)

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
  }, [historyHost])


  const openApp = () => {
    const pathToAppHtml = chrome.runtime.getURL("/app.html")
    chrome.tabs.create({
      url: pathToAppHtml
    });
  }

  return (
    <BodyStyle>
      {currentHost && (
        <div>
          <div className='domen'>
            {currentHost.icon && (
              <img src={currentHost.icon} alt="icon" className='icon' />
            )}
            <p className='no-margin'>{currentHost.host}</p>
          </div>

          <p className='time'>
            {timeFormater(currentHost.totalTime)}
          </p>

          <Days historyFull={currentHost.history} />
        </div>
      )}
      <Button onClick={openApp} fill>
        Открыть
      </Button>
    </BodyStyle>
  )
}


const BodyStyle = styled.div`
  padding: 12px;
  max-width: 500px;
  text-align: right;

  .domen {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background: #ccc;
  }

  .no-margin {
    margin: 0;
  }

  .time {
    font-weight: 600;
  }

`