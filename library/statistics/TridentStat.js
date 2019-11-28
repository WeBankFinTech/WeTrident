class TridentStat {
  // 控制用户点击是否自动上报
  static pressAutoStat = true
  // 控制网络请求是否自动上报，默认为false
  static httpRequestAutoReport = false

  static StatType = {
    sceneChange: 'sceneChange',
    userAction: 'userAction',
    httpRequest: 'httpRequest',

    // nativeError: 'nativeError',
    renderError: 'renderError',
    unhandlePromise: 'unhandlePromise',
  }
  static statEventHandler = (statEvent) => statEvent

  static setOnStatEventHandler (customStatEventHandler) {
    if (typeof customStatEventHandler === 'function') {
      this.statEventHandler = (statData) => {
        customStatEventHandler(statData)
      }
    }
  }

  static emitStatEvent(statData) {
    this.statEventHandler && this.statEventHandler(statData)
  }

  static setPressAutoReport (pressAutoReport = true) {
    this.pressAutoStat = pressAutoReport
  }

  static setHttpRequestAutoReport (httpRequestAutoReport = false) {
    this.httpRequestAutoReport = httpRequestAutoReport
  }
}

export default TridentStat
