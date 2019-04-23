/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator } from '@unpourtous/trident'


export default class DemoScene extends Component {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'DemoScene'
  })

  render () {
    return (
      <View>
        <Text>Hello DemoScene</Text>
      </View>
    )
  }
}
