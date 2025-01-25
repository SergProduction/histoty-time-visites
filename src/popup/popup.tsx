import "regenerator-runtime"
import "normalize.css/normalize.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/core/lib/css/blueprint.css"

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import "./connect"
import { Body } from "./body"

import { getHistoryVisit } from "../share-lib/chrome"
import { setHistoryVisits } from "./store/main"


function Main() {
  useEffect(() => {
    chrome.runtime.sendMessage({type: 'history_visit_tempSave' }, () => {
      getHistoryVisit().then(x => {
        setHistoryVisits(x)
      })
    })
  }, [])

  return (
    <Body />
  )
}

const rootHTML = document.getElementById('root') as HTMLElement

// rootHTML.setAttribute('class', 'bp3-dark') // "bp3-body"

// document.body.style.backgroundColor

ReactDOM.render(<Main />, rootHTML)

