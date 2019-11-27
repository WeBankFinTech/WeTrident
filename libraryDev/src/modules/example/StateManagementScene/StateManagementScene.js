/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:36:42.305Z.
 */
import React from 'react'
import { AppNavigator, WeBaseScene, Column } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import ObjectView from '../components/ObjectView'

export default class StateManagementScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'State Management'
  })

  render () {
    const { sceneCount, moduleCount, globalCount } = this.props
    return (
      <Column style={{ flex: 1 }}>
        <EntryList style={{ flex: 1 }}>
          <PrimaryButton text={`Scene Count Sync ${sceneCount}+1`} onPress={() => {
            this.props.addCount(1)
          }} />

          <PrimaryButton text={`Scene Count Async ${sceneCount}+10`} onPress={() => {
            this.props.addCountAsync(10)
          }} />

          <PrimaryButton text={`Module Count Sync ${moduleCount}+10`} onPress={() => {
            this.props.addModuleCount(10)
          }} />

          <PrimaryButton text={`Global Count Sync ${globalCount}+10`} onPress={() => {
            this.props.addGlobalCount(10)
          }} />

          <PrimaryButton text={`Go To StateShareScene`} onPress={() => {
            AppNavigator.example.StateShareScene()
          }} />
        </EntryList>

        <ObjectView {...this.props} />
      </Column>
    )
  }
}
