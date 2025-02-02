export function getDayId(dateUnix: number) {
  const x = new Date(dateUnix)
  x.setHours(0)
  x.setMinutes(0)
  x.setSeconds(0)
  x.setMilliseconds(0)
  return +x
}