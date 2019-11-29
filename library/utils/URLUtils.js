/**
 * Created by erichua on 17/04/2018.
 */
const URL = require('url')

export default class {
  static appendParams (url, paramsToAppend = {}) {
    const parsed = URL.parse(url, true)
    parsed.query = {
      ...(parsed.query || {}),
      ...paramsToAppend
    }
    parsed.search = undefined
    return URL.format(parsed)
  }
}
