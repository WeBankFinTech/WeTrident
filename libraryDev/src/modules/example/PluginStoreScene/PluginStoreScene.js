/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-09T12:52:38.196Z.
 */
import React from 'react'
import { AppNavigator, WeBaseScene, Button } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'

export default class PluginStoreScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'PluginStoreScene'
  })

  render () {
    return (
      <EntryList>
        <Button
          text='Plugin-WebView' onPress={() => {
            AppNavigator.tridentPluginWebView.WebViewScene({ url: 'https://www.qq.com' })
          }}
        />

        <Button
          text='Feedback' onPress={() => {
            AppNavigator.tridentPluginFeedback.FeedbackScene({
              title: '用户反馈',
              prodID: '107751',
              nickname: '河蟹',
              avatar: 'http://wx.qlogo.cn/mmopen/AnqmlwDJ37mQSv19wETm4QPfVualHOmShB0z6NoKp22kSv50nC6vQR3ibqf6VwWa63xZ1LJ8qdfHJjEcicW2j8LdZzg6qs7y0k/0',
              openid: 'trident_123',
              // 参照 customData 里面的参数名设置
              clientInfo: ' iPhone OS 10.3.1 / 3.2.0.43 / 0 '
            })
          }}
        />
      </EntryList>
    )
  }
}
