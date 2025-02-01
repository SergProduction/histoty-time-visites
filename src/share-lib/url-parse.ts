


const urlRegExp = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/

export function urlParseRegExp(url: string) {
  const defaultParams = {
    href: url,
    protocol: url,
    host: url,
    origin: url, // домент вместе с протоколом
    pathname: url, // все что после домена
    searchParams: url,
  }

  try {
    const urlParams = new URL(url)

    return urlParams
  } catch (err) {
    console.warn('urlParseRegExp error:', url)
    console.error(err)
    return defaultParams
  }
}
