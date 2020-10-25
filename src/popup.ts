'use strict';

let html_show_stat = document.getElementById('showstat') as HTMLButtonElement

html_show_stat.addEventListener('click', () => {
  chrome.storage.local.get(function (data) {
      const newWindow = window.open('about:blank')

      if (!newWindow) return

      const preTag = newWindow.document.createElement('pre')

      preTag.textContent = JSON.stringify(data.historyVisit, null, 2)

      newWindow.document.body.appendChild(preTag)
  })
})
