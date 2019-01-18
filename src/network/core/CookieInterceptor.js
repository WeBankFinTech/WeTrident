'use strict'

import Interceptor from './Interceptor.js'
import CookieManager from 'react-native-cookies'
import { Statistics } from 'plugins'

const md5 = require('md5')

export default class CookieInterceptor extends Interceptor {
  constructor (props) {
    super()

    this.lastCookie = {}
    this.lastCookieHashCode = ''
    this.onCookieChanged = props && props.onCookieChanged
  }

  requestInterceptor (request) {
    let promise = new Promise((resolve, reject) => {
      request.headers = request.headers || {}
      request.headers.Cookie = request.headers.Cookie || ''
      CookieManager.get(request.url, (err, nativeCookie) => {
        if (err) {
          console.warn('Get cookie error!')
          Statistics.reportEvent('cookieError')
          this.lastCookie = {}
          this.lastCookieHashCode = ''
          return resolve(request)
        }
        // console.log('Got cookies for url', nativeCookie);
        for (let key in nativeCookie) {
          let value = nativeCookie[key]
          request.headers.Cookie += key + '=' + value + ';'
        }

        if (request.url &&
          (request.url.indexOf('personal.webank.com') >= 0 || request.url.indexOf('personal.test.webank.com') >= 0)) {
          let requestHeaderParams = request.headers && request.headers.map && request.headers.map.params && JSON.parse(request.headers.map.params[0])
          if (
            nativeCookie.webankToken &&
            requestHeaderParams &&
            requestHeaderParams.requestToken !== nativeCookie.webankToken &&
            this.onCookieChanged
          ) {
            this.onCookieChanged(nativeCookie.webankToken)
          }

          let tmpCookieCode = this.lastCookieHashCode
          this.lastCookieHashCode = md5(request.headers.Cookie)

          if (tmpCookieCode && tmpCookieCode !== this.lastCookieHashCode) {
            try {
              Statistics.reportEvent('cookieChanged', {
                lCode: tmpCookieCode,
                lTime: this.lastCookie.time || '',
                lDcn: this.lastCookie.dcnNo || '',
                lWTK: md5(md5(this.lastCookie.webankToken || '')),
                cCode: this.lastCookieHashCode,
                cTime: nativeCookie.time || '',
                cDcn: nativeCookie.dcnNo || '',
                cWTK: md5(md5(nativeCookie.webankToken || ''))
              })
            } catch (error) {
              console.warn('requestInterceptor error')
            }
          }

          // if ((!tmpCookieCode ||
          //   tmpCookieCode !== this.lastCookieHashCode) &&
          //   this.onCookieChanged &&
          //   this.onCookieChanged.constructor === Function) {
          //   this.onCookieChanged(nativeCookie.webankToken)
          // }

          this.lastCookie = nativeCookie
        }

        return resolve(request)
      })
    })
    return promise
  }

  responseInterceptor (request, response, error) {
    return new Promise((resolve, reject) => {
      return resolve()
    })
  }

  static async getToken (url) {
    return new Promise((resolve, reject) => {
      CookieManager.get(url, (err, nativeCookie) => {
        if (err || !nativeCookie || !nativeCookie.webankToken) {
          return reject()
        }

        return resolve(nativeCookie.webankToken)
      })
    })
  }
}
