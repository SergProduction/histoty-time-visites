import { ItemHistoryVisit } from '../core/types'

export type ItemHistoryByHost = {
  host: string
  totalTime: number
}

export type ItemHistory = ItemHistoryVisit & ItemHistoryByHost