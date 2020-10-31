export const timeFormater = (milisecons: number) => {
  const fullSec = milisecons / 1000
  const sec = Math.floor(fullSec % 60)
  const fullMin = fullSec / 60
  const min = Math.floor(fullMin % 60)
  const fullHour = fullMin / 60
  const hour = Math.floor(fullHour % 60)
  const fulldays = fullHour / 24
  const days = Math.floor(fulldays / 24)
  if (days !== 0) {
    return `${days} days. ${hour}:${min}:${sec}`
  }
  return `${hour}:${min}:${sec}`
}


export const groupBy = <T extends { [k: string]: any }>(arr: T[], prop: string): { [k: string]: T[] } => arr
  .reduce<{ [k: string]: T[] }>((acc, it) => {
    const by = it[prop]
    if (acc[by] === undefined) {
      return { ...acc, [by]: [it] }
    } else {
      acc[by].push(it)
    }
    return acc
  }, {})

export const sortByProp = (prop: string) => <T extends { [k: string]: any }>(arr: T[], dir?: boolean): T[] => {
  if (dir === false) {
    return [...arr].sort((a, b) => a[prop] > b[prop] ? 1 : -1)
  }
  return [...arr].sort((a, b) => a[prop] < b[prop] ? 1 : -1)
}

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b)