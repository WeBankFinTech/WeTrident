/**
 * 负责用户交互逻辑
 *
 * Created by {{author}} on {{createAt}}.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator } from '@unpourtous/trident'


export default class TplScene extends Component {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'TplScene'
  })

  render () {
    return (
      <View>
        <Text>Hello TplScene</Text>
      </View>
    )
  }
}
