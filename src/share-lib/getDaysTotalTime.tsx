import { getDayId } from "./day-id";
import { historyMapGroupByHost } from "./history-map";
import { groupBy, sortByProp, sum } from "./pure";
import { ItemHistoryByHost, ItemHistoryFull } from "./types";

export type ItemHistoryDay = {
  day: number
  totalTime: number
  hosts: ItemHistoryByHost[]
}

export function getDaysTotalTime(hist: ItemHistoryFull[]): ItemHistoryDay[] {
  // добавляем айди дня
  const historyDayId = hist.map(x => ({
    ...x,
    day: getDayId(x.start)
  }));

  // группируем
  const historyDays = groupBy(historyDayId, 'day');

  // сортируем
  const historyDaySorted = Object.entries(historyDays).sort(([dayA], [dayB]) => dayA - dayB);

  // нормализуем
  const historyDayTotalTime = historyDaySorted.map(([day, hist]) => ({
    day: parseInt(day),
    totalTime: sum(hist.map(x => x.totalTime)),
    hosts: sortByProp('totalTime')(historyMapGroupByHost(hist), true)
  }));

  return historyDayTotalTime;
}
