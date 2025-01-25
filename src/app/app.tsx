import "regenerator-runtime"
import "normalize.css/normalize.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css"

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { NavigationTop } from './navigation'
import 'c3/c3.min.css'
import { getBytesInUse, getHistoryVisit } from "../share-lib/chrome"
import { setHistory } from "./store/main"
import { setBytesInUsed } from "./store/storage-size"




// TODO: реализовать сортировку списка с инпута по имени хоста


function Main() {

  useEffect(() => {
    getHistoryVisit().then(x => {
      setHistory(x)
    })

    getBytesInUse().then(x => {
      setBytesInUsed(x)
      console.log('getBytesInUse', x);
    })
  }, [])

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

