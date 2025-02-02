import { CancableTimeout } from './share-lib/cancable-timeout'

// content-script
// внедряется на каждую страницу, и остается там даже если она не активная вкладка

// 5 минут бездействия
const userActive = new CancableTimeout(4 * 60 * 1000)


userActive.onChange((isActive) => {
  // console.log('userActive', isActive);
  const msg = {
    type: 'history_visit_isActive',
    isActive,
    historyItem: {
      url: window.location.href,
      title: document.title,
      icon: getFaviconUrl()
    }
  }

  if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
    console.warn('chrome.runtime.sendMessage undefined', window.location.href);
    return
  }
  chrome.runtime.sendMessage(msg)
})


// Приостановка записи при не-активности
document.addEventListener('mousemove', function () {
  userActive.update()
})
document.addEventListener('scroll', function () {
  userActive.update()
})


function getFaviconUrl() {
  var favicon = undefined;
  var nodeList = document.getElementsByTagName("link");
  for (var i = 0; i < nodeList.length; i++) {
    if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
      favicon = nodeList[i].getAttribute("href");
    }
  }
  return favicon;
}
