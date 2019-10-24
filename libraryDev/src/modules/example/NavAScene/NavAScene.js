/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:28.443Z.
 */
import React, { Component } from 'react'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { L } from '@webank/trident/trident-ui/Layout/Layout'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import NavigationStackView from '../components/NavigationStackView'
import ObjectView from '../components/ObjectView'

export default class NavAScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavAScene'
  })

  render () {
    return (
      <L.Column>
        <EntryList>
          <PrimaryButton text={`Go NavBScene`} onPress={() => {
            AppNavigator.example.NavBScene()
          }} />
          <PrimaryButton text={`Back`} onPress={() => {
            AppNavigator.goBack()
          }} />
        </EntryList>

        <ObjectView ignoreKeys={[]} {...(this.params || {})} />

        <NavigationStackView routes={AppNavigator.getCurrentRoutes()} />

      </L.Column>
    )
  }
}
