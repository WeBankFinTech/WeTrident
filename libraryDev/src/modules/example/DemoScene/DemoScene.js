/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React from 'react'
import { WeBaseScene, AppNavigator, Theme } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import {
  Button
} from '@webank/trident'

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
      <EntryList style={[{
        backgroundColor: Theme.Color.backgroundPrimary
      }, this.props.style]}>
        <Button text={'Trident-Framework'} onPress={() => {
          AppNavigator.example.FrameworkScene()
        }} />

        <Button text={'Trident-UI'} onPress={() => {
          AppNavigator.ui.UIScene()
        }} />

        <Button text={'Plugin Store'} onPress={() => {
          AppNavigator.example.PluginStoreScene()
        }} />

        <Button text={'TabView'} onPress={() => {
          // AppNavigator.example.PluginStoreScene()
          AppNavigator.tabExample.TabContainerScene({
            // initialTab: 'Setting'
          })
        }} />
      </EntryList>
    )
  }
}
