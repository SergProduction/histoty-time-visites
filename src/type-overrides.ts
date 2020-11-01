declare module 'date-template' {
  type Replaced = {[key: string]: { value: string | number, key: RegExp | string }}
  const template: (format: string, date: number | Date, middleware?: (replaced: Replaced) => Replaced) => string
  export default template
}
