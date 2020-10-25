import { ItemHistoryVisit } from './types'

export const fetchPOST = (obj: any) => fetch(
  'http://localhost:3000',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
})

export const fetchGET = (): Promise<ItemHistoryVisit> => fetch('http://localhost:3000').then(r => r.json())
