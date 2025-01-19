import "regenerator-runtime"
import "normalize.css/normalize.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css"

import React from 'react'
import ReactDOM from 'react-dom'
import { fackTreeScheked } from './connect'
import { NavigationTop } from './navigation'
import { Classes, Card } from '@blueprintjs/core'
import 'c3/c3.min.css'





fackTreeScheked()

// TODO: реализовать сортировку списка с инпута по имени хоста


function Main() {
  return (
    <div>
      <NavigationTop />
    </div>
  )
}

const rootHTML = document.getElementById('root') as HTMLElement

// rootHTML.setAttribute('class', 'bp3-dark') // "bp3-body"

// document.body.style.backgroundColor

ReactDOM.render(<Main />, rootHTML)

