/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:32.010Z.
 */
import React from 'react'
import { AppNavigator, WeBaseScene, Column } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import NavigationStackView from '../components/NavigationStackView'

export default class NavBScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavBScene'
  })

  render () {
    return (
      <Column>
        <EntryList>
          <PrimaryButton text={`Back`} onPress={() => {
            AppNavigator.goBack()
          }} />

          <PrimaryButton text={`Back to NavigationScene`} onPress={() => {
            AppNavigator.goBack([AppNavigator.example.NavigationScene])
          }} />

          <PrimaryButton text={`Back to NavigationScene && push NavCScene`} onPress={() => {
            AppNavigator.goBackThenPush([AppNavigator.example.NavigationScene], AppNavigator.example.NavCScene)
          }} />
        </EntryList>
        <NavigationStackView routes={AppNavigator.getCurrentRoutes()} />
      </Column>
    )
  }
}
