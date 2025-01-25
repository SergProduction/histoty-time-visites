import { CancableTimeout } from './share-lib/cancable-timeout'


const userActive = new CancableTimeout(7 * 60 * 1000)


userActive.onChange((isActive) => {
  // console.log('userActive', isActive);
  var msg = {type: 'history_visit_isActive', payload: isActive}
  chrome.runtime.sendMessage(msg)
})


// Приостановка записи при не-активности
document.addEventListener('mousemove', function () {
  userActive.update()
})
document.addEventListener('scroll', function () {
  userActive.update()
})
