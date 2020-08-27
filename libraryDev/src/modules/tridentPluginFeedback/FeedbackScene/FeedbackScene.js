/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-12-09T09:46:43.725Z.
 */
import React from 'react'
import {
  Platform,
  KeyboardAvoidingView,
  WebView
} from 'react-native'
import { WeBaseScene } from '@webank/trident'

/**
 * Navigator数据传入
 * 1. title 标题
 * 2. prodID 吐个槽平台的产品id，https://tucao.qq.com
 *
 * 登录态相关
 * 3. openid 用户唯一标识
 * 4. nickname 用户昵称
 * 5. avatar 用户头像
 */

export default class FeedbackScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || '用户反馈'
  })

  constructor () {
    super(...arguments)

    const {
      prodID,
      title,
      ...data
    } = this.params
    this.FEEDBACK_PARAMS = `
      let FEEDBACK_PARAMS = {}
      FEEDBACK_PARAMS.prodID = ${prodID};
      FEEDBACK_PARAMS.data = ${JSON.stringify(data)};
      window.FEEDBACK_PARAMS = FEEDBACK_PARAMS;
    `
  }

  render () {
    const {
      prodID
    } = this.params

    if (!prodID) {
      return null
    }

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
      >
        <WebView
          source={Platform.OS === 'android' ? { uri: `https://support.qq.com/product/${prodID}` } : require('./redirect.html')}
          injectedJavaScript={this.FEEDBACK_PARAMS}
        />
      </KeyboardAvoidingView>
    )
  }
}
