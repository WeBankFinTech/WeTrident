/**
 * 主要负责后台数据的处理，为Scene和actions提供调用后台接口和处理后台的数据的服务
 *
 * Created by rcrabwu on 2019-09-01T10:36:12.859Z.
 */

import { Toast, Loading } from '@webank/trident'

class WebViewService {
  constructor () {
    this.api = {
      toast: this.toast,
      loading: this.loading
    }
    this.apiAsync = {
      setNavBarRightButton: this.setNavBarRightButton
    }
  }

  addApiHandler (key, handler) {
    if (typeof key === 'string' && typeof handler === 'function') {
      this.api[key] = (sceneContext, argsFromWeb) => {
        const {
          data
        } = argsFromWeb
        handler(data)
        sceneContext.postMessageToWebView({ ...argsFromWeb, args: null, isSuccess: true })
      }
    }
  }

  addAsyncApiHandler (key, handler) {
    if (typeof key === 'string' && typeof handler === 'function') {
      this.api[key] = (sceneContext, argsFromWeb) => {
        const {
          data
        } = argsFromWeb
        handler(data).then(res => {
          sceneContext.postMessageToWebView({ ...argsFromWeb, args: res, isSuccess: true })
        }, err => {
          console.log('[WebViewService.addAsyncApiHandler] reject %o', err)
          sceneContext.postMessageToWebView({ ...argsFromWeb, args: err, isSuccess: false })
        })
      }
    }
  }

  toast (sceneContext, argsFromWeb) {
    const {
      data: {
        text
      } = {}
    } = argsFromWeb
    if (text) {
      Toast.show(text)
      sceneContext.postMessageToWebView({ ...argsFromWeb, args: null, isSuccess: true })
    } else {
      sceneContext.postMessageToWebView({ ...argsFromWeb, args: { message: 'text can\' be null' }, isSuccess: false })
    }
  }

  loading (sceneContext, argsFromWeb) {
    const {
      data: {
        show = true
      } = {}
    } = argsFromWeb
    show ? Loading.show() : Loading.hide()
    sceneContext.postMessageToWebView({ ...argsFromWeb, args: null, isSuccess: true })
  }

  setNavBarRightButton (sceneContext, argsFromWeb) {
    const {
      data: {
        show = true,
        text = ''
      } = {}
    } = argsFromWeb
    sceneContext.setParams({
      showRightButton: show,
      rightButtonText: text,
      onPressRightButton: show ? () => {
        sceneContext.postMessageToWebView({ ...argsFromWeb, args: null, isSuccess: true })
      } : null
    })
  }
}
export default new WebViewService()
