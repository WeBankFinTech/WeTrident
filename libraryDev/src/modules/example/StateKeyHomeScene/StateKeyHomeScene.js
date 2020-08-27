/**
 * 负责用户交互逻辑
 *
 * Created by lhtin on 2019-12-13T11:19:01.084Z.
 */
import React from 'react'
import { AppNavigator, Button, WeBaseScene } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'

export default class StateKeyHomeScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'StateKeyHomeScene'
  })

  render () {
    return (
      <EntryList style={{ flex: 1 }}>
        <Button text={'WeTrident'} onPress={() => {
          AppNavigator.example.StateKeyScene({ id: 'prod-1' })
        }} />

        <Button text={'React'} onPress={() => {
          AppNavigator.example.StateKeyScene({ id: 'prod-2' })
        }} />
      </EntryList>
    )
  }
}
