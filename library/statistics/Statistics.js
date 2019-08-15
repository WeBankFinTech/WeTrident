// FIXME Statistics
const Statistics = {
  reportEvent: v => v
}
class StatisticsProxy {
  static dataReportInstance = undefined
  static proxyMethodList = [
    'reportSceneStayTime',
    'reportElementDisplay',
    'reportClickAction'
  ]

  static setDataReportInstance (instance) {
    this.dataReportInstance = instance
    this.init()
  }

  static init () {
    if (this.dataReportInstance === undefined) {
      this.proxyMethodList.forEach(methodName => {
        this[methodName] = () => {
          console.warn(methodName + '未实现')
        }
      })
      return
    }
    this.proxyMethodList.forEach(methodName => {
      this[methodName] = () => {
        if (typeof this.dataReportInstance[methodName] === 'function') {
          this.dataReportInstance[methodName]()
        }
      }
    })
  }
}

StatisticsProxy.init()

StatisticsProxy.setDataReportInstance({
  /**
   * 上报页面停留时长, 不需要在客户端计算耗时,
   * 直接上报开始和结束事件到后台计算, 避免出现耗时异常而无法查的情况
   * @param eventName 耗时事件的key
   * @param startTimeInMs 事件的开始时间
   * @param endTimeInMs 事件的结束时间
   */
  reportSceneStayTime: (startTimeInMs, endTimeInMs, sceneUrl, type) => {
    const obj = {}
    obj.startTime = startTimeInMs
    obj.endTime = endTimeInMs
    if (obj.endTime && obj.startTime) {
      // 100毫秒每一段，方便在mta上统计数据
      obj.timeRange = parseInt((obj.endTime - obj.startTime) / 100) * 100
    }
    obj.sceneUrl = sceneUrl
    obj.type = type
    obj.detail = sceneUrl + ' ' + type + ' ' + obj.timeRange
    Statistics.reportEvent('sceneStayTime', obj)
  },

  /**
   * 上报用户行为事件, 这里的用户行为包括点击/滑动/长按等各种操作
   * @param clickEventName 被点击的元素的值
   * @param extKv 供一些特殊场景需要添加额外的参数使用, 需要跟大数据分析的和产品确认以后确定有必要添加才使用
   */
  reportClickAction: (clickEventName, extKv) => {
    const obj = {}
    obj.buttonName = clickEventName // 这里key使用"buttonName"是为了和后台数据分析系统, 以及历史数据兼容
    obj.path = this._getCurrentSceneURL()
    obj.refer = this._getLastSceneURL()
    obj.ridList = RidPath.getRidList()
    const keepWords = ['buttonName', 'path', 'refer', 'ridList']
    if (extKv && _.isObject(extKv)) {
      for (const k in extKv) {
        if (keepWords.indexOf(k) !== -1) {
          console.log(k + ' is not allowd, change one pls')
        } else {
          obj[k] = extKv[k]
        }
      }
    }

    Statistics.reportEvent('clickButton', obj) // 这里eventName使用"clickButton"是为了和后台数据分析系统, 以及历史数据兼容
    console.log(STATISTICS_PREFIX + 'clickButton:' + JSON.stringify(obj))
  },

  /**
   * 元素曝光上报, 页面的曝光底层已经统一上报,
   * 但是需要上报某些页面内模块是否展示,
   * 例如某些满足某条件才展示的入口, 广告曝光, 页面弹窗等页面内的元素曝光
   * @param elementName 页面元素的名字
   */
  reportElementDisplay: (elementName) => {
    const obj = {}
    obj.elementName = elementName
    obj.path = this._getCurrentSceneURL()
    obj.refer = this._getLastSceneURL()
    Statistics.reportEvent('elementDisplay', obj)
  },

  /**
   * 上报异常类型的数据
   * @param {string} key - key必须来自ExceptionKeys
   * @param {string} message - 异常信息
   */
  reportException: (key, message) => {
    console.log('reportException', key)
    if (ExceptionKeyList.indexOf(key) < 0) {
      console.error(`上报的异常的key(${key})没有在ExceptionKeys中找到，如果是新加的请先在plugin/constants/ExceptionKeys.js中添加`)
    } else {
      Statistics.reportEvent('Exception', {
        [key]: message,
        [key + '__count__']: message
      })
    }
  }
})

export default StatisticsProxy
