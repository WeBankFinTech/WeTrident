/**
 * Created by erichua on 15/03/2018.
 */

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import {
  Dialog,
  WePropTypes,
  WeTouchable
} from 'apps/webankPro/bizComponents'
import { WeApi } from 'apps/webankPro/api'
import { LoginHelper } from 'apps/webankPro/serviceHelper'

let countDownFrom = 5
export default class RetryDialog extends Component {
  static propTypes = {
    onPressRetry: WePropTypes.func,
    onPressLogout: WePropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      countDown: countDownFrom
    }
  }

  timer () {
    if (this.state.countDown > 0) {
      this.setState({countDown: this.state.countDown - 1})
    } else {
      this.countDownInterval && clearInterval(this.countDownInterval)
    }
  }

  componentDidMount () {
    this.countDownInterval = setInterval(() => this.timer(), 1000)
  }

  render () {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Dialog
          texts={[`网络异常，拉取数据失败，请检查网络后重试`]}
          items={[
            {
              text: this.state.countDown > 0 ? `${this.state.countDown}s后重试` : '重试',
              pressMode: WeTouchable.pressMode.none,
              onItemPress: this.state.countDown === 0 ? () => {
                this.props.onPressRetry && this.props.onPressRetry()
                countDownFrom += 5
              } : () => {}
            },
            {
              text: '重新登录',
              pressMode: WeTouchable.pressMode.none,
              onItemPress: () => {
                WeApi.resetCache()
                LoginHelper.reLogin()
                countDownFrom += 5
                this.props.onPressLogout && this.props.onPressLogout()
              }
            }
          ]}
        />
      </View>
    )
  }
}
