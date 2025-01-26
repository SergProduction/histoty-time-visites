import { CancableTimeout } from './share-lib/cancable-timeout'

// content-script
// внедряется на каждую страницу, и остается там даже если она не активная вкладка

// 5 минут бездействия
const userActive = new CancableTimeout(4 * 60 * 1000)


userActive.onChange((isActive) => {
  // console.log('userActive', isActive);
  const msg = {
    type: 'history_visit_isActive',
    payload: isActive
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
