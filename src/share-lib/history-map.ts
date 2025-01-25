import { ItemHistoryByHost, ItemHistoryFull } from "./types"
import { groupBy, sum } from "./pure"



export const historyMapGroupByHost = (his: ItemHistoryFull[]): ItemHistoryByHost[] => {
  const hisMapHost = groupBy(his, 'host')
  return Object.keys(hisMapHost).map(host => {
    const hisHost = hisMapHost[host]
    const totalTime = sum(hisHost.map(h => h.totalTime))
    return { host, totalTime: totalTime }
  })
}
