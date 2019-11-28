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
        <Button text={'Plugin-WebView'} onPress={() => {
          AppNavigator.tridentPluginWebView.WebViewScene({ url: 'https://www.qq.com' })
        }} />
      </EntryList>
    )
  }
}
