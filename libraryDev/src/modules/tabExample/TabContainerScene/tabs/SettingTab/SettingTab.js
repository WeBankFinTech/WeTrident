/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:53.929Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import NavBar from '../../components/NavBar'
import dimens from '@webank/trident/library/uiComponent/dimens'

export default class SettingTab extends WeBaseScene {

  componentDidMount () {
    console.log('SettingTab componentDidMount', this.props)
  }

  render () {
    return (
      <View style={{paddingTop: dimens.TOTAL_NAV_BAR_HEIGHT}}>
        <NavBar
          title={'SettingTab'}
          hideLeftButton
        />
        <Text>Hello SettingTab</Text>
        <PrimaryButton text={'Trident-Framework'} onPress={() => {
          // this.props.navigation.navigate('HomeTab')
          AppNavigator.ui.UIScene()
        }} />
      </View>
    )
  }
}
