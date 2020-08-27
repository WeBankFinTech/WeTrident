const Sdk = `class Sdk {
  constructor() {
    this.callbacks = {}
    this._init()
  }

  _init() {
    document.addEventListener('message', e => {
      let message
      try {
        message = JSON.parse(e.data)
        console.log('message received from react native: ', message)
      } catch (err) {
        console.error('failed to parse message from react-native: ', err)
        return
      }
      // trigger callback
      if (this.callbacks[message.msgId]) {
        if (message.isSuccess) {
          this.callbacks[message.msgId].onSuccess(message.args)
        } else {
          this.callbacks[message.msgId].onError(message.args)
        }
        delete this.callbacks[message.msgId]
      }
    })
  }

  send(targetFunc, data, success, error) {
    const msgObj = {
      targetFunc: targetFunc,
      data: data || {}
    }
    if (success || error) {
      msgObj.msgId = this._guid()
    }
    console.log('sending message ' + msgObj.targetFunc)
    if (msgObj.msgId) {
      this.callbacks[msgObj.msgId] = {
        onSuccess: success,
        onError: error
      }
    }
    window.postMessage(JSON.stringify(msgObj))
  }

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }
}`

const TridentWebViewBridge = `
  ${Sdk};
  window.TridentWebViewBridge = new Sdk();
`
export default TridentWebViewBridge
