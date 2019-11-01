/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React from 'react'
import { WeBaseScene, AppNavigator } from '@webank/trident'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import EntryList from '../../../bizComponents/EntryList'

export default class DemoScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'Trident Demo',
  })

  constructor () {
    super(...arguments)
  }

  componentDidMount () {
      setTimeout(() => {
          this.setState({
              startTest: true
          })
      }, 3000)
  }

  onPause (fromScene, toScene) {
    super.onPause(fromScene, toScene)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <EntryList>
        <PrimaryButton text={'Trident-Framework'} onPress={() => {
          AppNavigator.example.FrameworkScene()
        }} />

        <PrimaryButton text={'Trident-UI'} onPress={() => {
          AppNavigator.ui.UIScene()
        }} />

        <PrimaryButton text={'Plugin Store'} onPress={() => {
          AppNavigator.example.PluginStoreScene()
        }} />
      </EntryList>
    )
  }
}
