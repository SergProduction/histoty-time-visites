
const urlRegExp = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/

export function urlParseRegExp(url: string) {
  const defaultParams = {
    fullUrl: url,
    protocol: url,
    host: url,
    path: url,
    file: url,
    query: url,
    hash: url
  }

  try {
    const maybeParams = urlRegExp.exec(url)

    if (maybeParams === null) {
      // console.warn('urlParseRegExp error:', url)
      return defaultParams
    }

    const [
      fullUrl,
      protocol,
      host,
      path,
      file,
      query,
      hash
    ] = maybeParams

    return {
      fullUrl,
      protocol,
      host,
      path,
      file,
      query,
      hash
    }
  } catch (err) {
    console.warn('urlParseRegExp error:', url)
    console.error(err)
    return defaultParams
  }
}
