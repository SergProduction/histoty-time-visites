// примерно 250 байт стоит такой объект с 4 полями
export type ItemHistoryVisit = {
  title: string,
  url: string,
  start: number,
  end: null | number
}
