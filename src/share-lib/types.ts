
// примерно 250 байт стоит такой объект с 4 полями
export type ItemHistoryVisit = {
  title: string,
  url: string,
  icon?: string,
  start: number,
  end: number
}


export type ItemHistoryFull = ItemHistoryVisit & {
  host: string
  totalTime: number
}


export type ItemHistoryByHost = {
  host: string
  icon?: string,
  totalTime: number
  history: Array<ItemHistoryFull>
}
