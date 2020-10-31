import { CancableTimeout } from './core/lib'


const userActive = new CancableTimeout(7 * 60 * 1000)


userActive.onChange((isActive) => {
  var msg = {type: 'history_visit_isActive', payload: isActive}
  chrome.runtime.sendMessage(msg)
})


document.addEventListener('mousemove', function () {
  userActive.update()
})