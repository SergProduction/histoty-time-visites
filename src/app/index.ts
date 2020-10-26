'use strict';
import { StorageAreaMyContent, isStorageAreaExistMyContent } from '../core/types'

/*
// отсортировать по урлу
t.filter(h => h.url.includes('nestjs'))
// получить время посещения одного айтема
t1 = t.map(h => h.end - h.start)
// получить общие время всех айтемов
t2 = t1.reduce((a, b) => a+b))
*/


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  )
  if (request.type == "historyVisit") {
    console.log(request.payload)
    sendResponse({type: "ok"})
  }
})
