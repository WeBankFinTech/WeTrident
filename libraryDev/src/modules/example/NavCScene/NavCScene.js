/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:37.177Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { Column } from '@webank/trident/trident-ui/Layout/Layout'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import ObjectView from '../components/ObjectView'
import NavigationStackView from '../components/NavigationStackView'

export default class NavCScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavCScene'
  })

  render () {
    return (
      <Column>
        <EntryList>
          <PrimaryButton text={`Back`} onPress={() => {
            AppNavigator.goBack()
          }} />
        </EntryList>
        <NavigationStackView routes={AppNavigator.getCurrentRoutes()} />
      </Column>
    )
  }
}
