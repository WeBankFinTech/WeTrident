/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:37.177Z.
 */
import React from 'react'
import { AppNavigator, WeBaseScene, Column, Button } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import NavigationStackView from '../components/NavigationStackView'

export default class NavCScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavCScene'
  })

  render () {
    return (
      <Column>
        <EntryList>
          <Button
            text='Back' onPress={() => {
              AppNavigator.goBack()
            }}
          />
        </EntryList>
        <NavigationStackView routes={AppNavigator.getCurrentRoutes()} />
      </Column>
    )
  }
}
