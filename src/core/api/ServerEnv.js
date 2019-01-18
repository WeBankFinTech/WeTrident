import ServerPrefixType from './ServerPrefixType'

export default class ServerEnv {
  static ENV_PREFIX = {
    // cgi,
    // op,
    // static,
    // tencent,
  }

  /**
   * 默认返回行内的前缀, 如果传入了OP或者腾讯云则返回对应的前缀
   * @param customPrefix
   * @returns {string}
   */
  static getWebankBaseUrl (customPrefix) {
    return ServerEnv.ENV_PREFIX[customPrefix]
  }

  static isInTestEvn () {
    return ServerEnv.ENV_PREFIX['ENV_NAME'] !== 'PROD'
  }

  static getAgreementBaseUrl () {
    if (ServerEnv.isInTestEvn()) {
      return ServerEnv.getWebankBaseUrl(ServerPrefixType.DATA_CGI_PREFIX)
    } else {
      return ServerEnv.getWebankBaseUrl(ServerPrefixType.CDN) + 'querydata/'
    }
  }

  /**
   * 初始化后台的环境链接, 规则保持和HJ一致
   * @param envStr
   */
  static init (envStr = '{}') {
    const parseEnv = JSON.parse(envStr)

    const env = (parseEnv.CGI_PREFIX && parseEnv.CGI_PREFIX.indexOf('https://personal.webank.com/hj/')) !== -1 ? 'pro' : 'test'

    const qCloudFeedbackCGIPrefixMap = {
      pro: 'https://fs.webank.com/',
      test: 'https://sit-fs.test.webank.com/'
    }

    const customerServiceCDNCGIPrefixMap = {
      pro: 'https://www.webankcdn.net/',
      test: 'https://h.sit.test.webankcdn.net/'
    }

    const htrCGIPrefixMap = {
      pro: 'https://personal.webank.com/wm-hjhtr/',
      test: 'https://personal.test.webank.com/k/wm-hjhtr/'
    }

    const remotePageCDNCGIPrefixMap = {
      pro: 'https://personal.webank.com/s/hj/op/app/',
      test: 'https://personal.test.webank.com/s/hj/op/app/'
    }

    const cdnHjupload = {
      pro: 'https://www.webankcdn.net/s/hjupload/',
      test: 'https://sit.test.webankcdn.net/s/hjupload/'
    }

    // "https://personal.webank.com/hj/\
    ServerEnv.ENV_PREFIX = {
      ...JSON.parse(envStr),
      [ServerPrefixType.Q_CLOUD_FB]: qCloudFeedbackCGIPrefixMap[env], // 反馈系统用的腾讯云前缀
      [ServerPrefixType.CS_CDN]: customerServiceCDNCGIPrefixMap[env],
      [ServerPrefixType.REMOTE_PAGE]: remotePageCDNCGIPrefixMap[env], // 远端页面需要
      [ServerPrefixType.CGI_PREFIX_HJHTR]: htrCGIPrefixMap[env],
      [ServerPrefixType.CDN_HJUPLOAD]: cdnHjupload[env]
    }
  }

  static getDefaultHeadUrl () {
    return 'https://hjdata.webank.com/querydata/html/hjAdmAdminPic/ic_default_head-27903352717.png'
  }
}
