export default class Cache {
  storageEngine = new Map()

  read (key, cacheMaxAgeInMs) {
    // 判断createTime
    const value = this.storageEngine.get(key)
    if (value && value.createAt && (value.createAt + cacheMaxAgeInMs > new Date().getTime())) {
      return value
    }
    return undefined
  }

  write (key, value) {
    this.storageEngine.set(key, value)
  }

  clear (key) {
    // TODO
  }

  clearAll () {
    // TODO
  }
}
