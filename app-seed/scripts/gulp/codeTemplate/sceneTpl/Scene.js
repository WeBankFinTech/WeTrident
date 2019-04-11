/**
 * 主要负责用户交互逻辑，
 * 用户的交互产生的状态数据通过actions记录到store上，
 * 获取后台的数据需要通过actions或者Service(取决于是否需要记录到store)，避免在Scene里面直接调用后台
 *
 * Created by sines on 2018-02-23T10:25:07.640Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'

// import PropTypes from 'prop-types'
// import ChartExampleService from './ChartExampleService'
import { AppNavigator } from '@unpourtous/trident'


export default class {{sceneName}} extends Component {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || ''
  })

  render () {
    return (
      <View>
        <Text>{{ sceneName }}</Text>
      </View>
    )
  }
}
