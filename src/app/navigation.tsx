import React, { useState } from 'react'
import { useStore } from 'effector-react'
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Tabs,
  Tab,
  ProgressBar,
  Intent,
  Classes,
  Button,
} from '@blueprintjs/core'

import {
  $bytesInUsed
} from './store/storage-size'

import { HistoryHost } from './view/host'
import { HistoryTimeVisite } from './view/history'

// TODO: добавить избранное
// TODO: добавить переименование в избранном


const config = [
  {
    title: 'History',
    path: 'history',
    component: HistoryTimeVisite,
  },
  {
    title: 'Host',
    path: 'host',
    component: HistoryHost,
  },
  {
    title: 'Stat',
    path: 'stat',
    component: () => (
      <p>статистика, соклько всего времени, сколько вкладок посетил, за какое время</p>
    ),
  },
]


const Body = ({ tabId }: { tabId: string }) => {
  const r = config.find(r => r.path === tabId)
  return r ? React.createElement(r.component) : null
}


const MAXSIZE_CHROMESTORAGE = 5242880

export const NavigationTop = () => {
  const [tabId, setTabId] = useState<string>('history')
  const bytesInUsed = useStore($bytesInUsed)

  // console.log(bytesInUsed, bytesInUsed / MAXSIZE_CHROMESTORAGE)

  return (
    <div>
      <Navbar fixedToTop>
        <NavbarGroup>
          <NavbarHeading>History</NavbarHeading>
          <NavbarDivider />
          <Tabs
            renderActiveTabPanelOnly
            animate
            id={tabId}
            onChange={(t) => setTabId(t as string)}
          >
            {config.map(r => (
              <Tab id={r.path} title={r.title} />
            ))}
          </Tabs>
        </NavbarGroup>
        <NavbarGroup align="right">
          <div style={{ width: '100px' }}>
            <ProgressBar
              animate={false}
              intent={Intent.PRIMARY}
              value={bytesInUsed / MAXSIZE_CHROMESTORAGE}
            />
          </div>
        </NavbarGroup>
      </Navbar>
      <div style={{ paddingTop: '50px' }}>
        <Body tabId={tabId} />
      </div>
    </div>
  )
}