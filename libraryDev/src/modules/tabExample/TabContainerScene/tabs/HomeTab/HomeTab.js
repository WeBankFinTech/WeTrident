/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:28.998Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import NavBar from '../../components/NavBar'


export default class HomeTab extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'HomeTab'
  })

  componentDidMount () {
    console.log('HomeTab componentDidMount', this.props)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
    console.log('fuck')
  }

  render () {
    return (
      <View>
        <NavBar
          title={this.props.count}
          hideLeftButton
        />
        <Text>Hello HomeTab</Text>
      </View>
    )
  }
}
