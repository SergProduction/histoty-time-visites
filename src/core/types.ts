// примерно 250 байт стоит такой объект с 4 полями
export type ItemHistoryVisit = {
  title: string,
  url: string,
  start: number,
  end: null | number
}

export type StorageAreaMyContent = { historyVisit: ItemHistoryVisit[] } & {[k: string]: any}

export const isStorageAreaExistMyContent = (s: {[k: string]: any}): s is StorageAreaMyContent => {
  return Array.isArray(s.historyVisit)
}
