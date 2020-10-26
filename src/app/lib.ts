export const timeFormater = (milisecons: number) => {
  const fullSec = milisecons / 1000
  const sec = Math.floor(fullSec % 60)
  const fullMin = fullSec / 60
  const min = Math.floor(fullMin % 60)
  const fullHour = fullMin / 60
  const hour = Math.floor(fullMin % 60)
  const days = Math.floor(fullHour % 24)
  if (days !== 0) {
    return `${days} days. ${hour}:${min}:${sec}`
  }
  return `${hour}:${min}:${sec}`
}
