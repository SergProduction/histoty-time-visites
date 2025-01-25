import React, { useState } from 'react'
import { useStore } from 'effector-react'
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Tabs,
  Tab,
} from '@blueprintjs/core'


import { HistoryHost } from './view/host'
import { HistoryTimeVisite } from './view/history'
import { Chart } from './view/c3'
import { UserStore } from './view/userStor'


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
    title: 'Chart',
    path: 'chart',
    component: Chart,
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



export const NavigationTop = () => {
  const [tabId, setTabId] = useState<string>('history')

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
          <UserStore />
        </NavbarGroup>
      </Navbar>
      <div style={{ paddingTop: '50px' }}>
        <Body tabId={tabId} />
      </div>
    </div>
  )
}