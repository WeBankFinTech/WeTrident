/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React from 'react'
import { WeBaseScene, AppNavigator } from '@webank/trident'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import EntryList from '../../../bizComponents/EntryList'
import { Theme } from '@webank/trident/trident-ui/theme'

export default class DemoScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'Trident Demo',
  })

  constructor () {
    super(...arguments)
  }

  onPause (fromScene, toScene) {
    super.onPause(fromScene, toScene)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <EntryList style={[{
        backgroundColor: Theme.Color.backgroundPrimary
      }, this.props.style]}>
        <PrimaryButton text={'Trident-Framework'} onPress={() => {
          AppNavigator.example.FrameworkScene()
        }} />

        <PrimaryButton text={'Trident-UI'} onPress={() => {
          AppNavigator.ui.UIScene()
        }} />

        <PrimaryButton text={'Plugin Store'} onPress={() => {
          AppNavigator.example.PluginStoreScene()
        }} />

        <PrimaryButton text={'TabView'} onPress={() => {
          // AppNavigator.example.PluginStoreScene()
          AppNavigator.tabExample.TabContainerScene({
            // initialTab: 'Setting'
          })
        }} />
      </EntryList>
    )
  }
}
