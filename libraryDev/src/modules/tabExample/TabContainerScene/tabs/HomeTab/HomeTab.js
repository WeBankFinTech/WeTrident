/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:28.998Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import NavBar from '../../components/NavBar'
import dimens from '@webank/trident/library/uiComponent/dimens'

export default class HomeTab extends WeBaseScene {

  componentDidMount () {
    console.log('HomeTab componentDidMount', this.props)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <View style={{paddingTop: dimens.TOTAL_NAV_BAR_HEIGHT}}>
        <NavBar
          title={'HomeTab'}
          hideLeftButton
        />
        <Text>Hello HomeTab</Text>
      </View>
    )
  }
}
