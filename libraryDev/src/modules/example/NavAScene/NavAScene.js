/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:28.443Z.
 */
import React from 'react'
import { AppNavigator, WeBaseScene, Column, Button } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import NavigationStackView from '../components/NavigationStackView'
import ObjectView from '../components/ObjectView'

export default class NavAScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavAScene'
  })

  render () {
    return (
      <Column>
        <EntryList>
          <Button text={`Go NavBScene`} onPress={() => {
            AppNavigator.example.NavBScene()
          }} />
          <Button text={`Back`} onPress={() => {
            AppNavigator.goBack()
          }} />
        </EntryList>

        <ObjectView ignoreKeys={[]} {...(this.params || {})} />

        <NavigationStackView routes={AppNavigator.getCurrentRoutes()} />

      </Column>
    )
  }
}
