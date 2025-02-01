
export function log(...params: any) {
  if (globalThis.log) {
    console.log('background: ', ...params)
  }
}