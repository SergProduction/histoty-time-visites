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
import { UserStoreSize } from './view/userStor'
import styled from 'styled-components'
import { Days } from './view/days'


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
    title: 'Days',
    path: 'days',
    component: Days,
  },
  /* 
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
 */
]


const Body = ({ tabId }: { tabId: string }) => {
  const r = config.find(r => r.path === tabId)
  return r ? React.createElement(r.component) : null
}



export const NavigationTop = () => {
  const [tabId, setTabId] = useState<string>('history')

  return (
    <DivStyle>
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
              <Tab id={r.path} title={r.title} key={r.path} />
            ))}
          </Tabs>
        </NavbarGroup>
        <NavbarGroup align="right">
          <UserStoreSize />
        </NavbarGroup>
      </Navbar>
      <div className='body'>
        <Body tabId={tabId} />
      </div>
    </DivStyle>
  )
}

const DivStyle = styled.div`
  .body {
    padding: 10px;
    padding-top: 50px
  }
`