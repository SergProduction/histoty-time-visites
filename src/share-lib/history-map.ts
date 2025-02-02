import { ItemHistoryByHost, ItemHistoryFull } from "./types"
import { groupBy, sortByProp, sum } from "./pure"



export const historyMapGroupByHost = (his: ItemHistoryFull[]): ItemHistoryByHost[] => {
  const histGroupHost = groupBy(his, 'host')
  const histHost = Object.keys(histGroupHost).map(host => {
    const hisHost = histGroupHost[host]
    const totalTime = sum(hisHost.map(h => h.totalTime))
    const firstHost = hisHost[0]
    return {
      host,
      icon: firstHost.icon,
      totalTime: totalTime,
      history: hisHost
    }
  })

  return sortByProp('totalTime')(histHost, true)
}
