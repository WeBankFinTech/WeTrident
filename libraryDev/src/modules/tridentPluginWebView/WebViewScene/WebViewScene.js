/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-09-01T10:36:12.859Z.
 */
import React, { Component } from 'react'
import {
  Platform,
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  WebView,
  StyleSheet
} from 'react-native'
import { WeBaseScene, AppNavigator } from '@webank/trident'
import TridentWebViewBridge from './TridentWebViewBridge'
import WebViewService from '../services/WebViewService'
import NavBackButton from '../components/NavBackButton'


export default class WebViewScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || '',
    headerLeft: <NavBackButton onPress={params.onPressBack} />
  })

  constructor () {
    super(...arguments)
    this.webView = null
    this.canGoBack = false
    this.setParams({
      onPressBack: () => {
        if (this.canGoBack) {
          this.webView && this.webView.goBack()
        } else {
          AppNavigator.goBack()
        }
      }
    })
  }

  onReceiveWebViewMessage (event = {}) {
    console.log('[onReceiveWebViewMessage]:', event.nativeEvent)
    try {
      let argsFromWeb = JSON.parse(event.nativeEvent.data)
      const {targetFunc} = argsFromWeb
      if (WebViewService.api[targetFunc]) {
        WebViewService.api[targetFunc](this, argsFromWeb)
      } else if (WebViewService.apiAsync[targetFunc]) {
        WebViewService.apiAsync[targetFunc](this, argsFromWeb)
      } else {
        this.postMessageToWebView({...argsFromWeb, args: {message: 'nonsupport method'}, isSuccess: false})
      }
    } catch (e) {
      console.warn(e.toString() + '\nCheck the "postMessage" method in your web app' + e.toString())
    }
  }

  postMessageToWebView (argsFromWeb) {
    console.log('[postMessageToWebView]:', argsFromWeb)
    this.webView && this.webView.postMessage(JSON.stringify(argsFromWeb))
  }

  onNavigationStateChange (event = {}) {
    console.groupCollapsed('[onNavigationStateChange] event %o', event)

    if (event.title && event.title !== this.params.title) {
      this.setParams({title: event.title})
    }

    // update canGoBack
    if (event.canGoBack !== this.canGoBack) {
      this.canGoBack = event.canGoBack
      console.log('[update canGoBack]', event.url, event.canGoBack)
    }
  }

  render () {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}>
        <WebView
          source={{uri: this.params.url}}
          ref={ref => this.webView = ref}
          onMessage={this.onReceiveWebViewMessage.bind(this)}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          injectedJavaScript={TridentWebViewBridge}
          renderError={this.renderError.bind(this)}
          // onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
          // onLoad={proxy => { console.log('[onLoad]', proxy.nativeEvent) }}
          // onLoadEnd={this._onLoadEnd.bind(this)}
          // onError={this._onError.bind(this)}
        />
      </KeyboardAvoidingView>
    )
  }

  renderError () {
    return (
      <View style={styles.error}>
        <Text>网络似乎遇到一些问题</Text>
        <Button
          title={'重试'}
          onPress={() => {
            this.webView.reload()
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
})