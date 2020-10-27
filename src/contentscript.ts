type UserCheckListener = (isActive: boolean) => void

class UserActive {
  isActive: boolean
  timer?: number
  listener: UserCheckListener
  constructor() {
    this.isActive = true
    this.timer = undefined
    this.listener = () => {}
  }

  onChange(checkListener: UserCheckListener) {
    this.listener = checkListener
  }

  active() {
    if (this.isActive === false) {
      this.isActive = true
      this.listener(this.isActive)
    }
    window.clearTimeout(this.timer)
    this.timer = window.setTimeout(() => {
      this.isActive = false
      this.listener(this.isActive)
    }, 5 * 1000)
  }
}

const userActive = new UserActive()

userActive.onChange((isActive) => {
  var msg = {type: 'history_visit_isActive', payload: isActive}
  chrome.runtime.sendMessage(msg)
})


document.addEventListener('mousemove', function () {
  userActive.active()
})