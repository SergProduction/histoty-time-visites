import { restore, createEvent } from 'effector'


export const setBytesInUsed = createEvent<number>()

export const $bytesInUsed = restore(setBytesInUsed, 0)
