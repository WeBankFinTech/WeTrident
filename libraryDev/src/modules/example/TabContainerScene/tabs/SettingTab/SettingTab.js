/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:53.929Z.
 */
import React from 'react'
import { View } from 'react-native'
import { WeBaseScene, dimens } from '@webank/trident'
import NavBar from '../../components/NavBar'
import TridentUIDemo from '../../../../ui/UIScene/components/TridentUIDemo'

export default class SettingTab extends WeBaseScene {

  render () {
    return (
      <View style={{paddingTop: dimens.TOTAL_NAV_BAR_HEIGHT}}>
        <NavBar
          title={'SettingTab'}
          hideLeftButton
        />
        <TridentUIDemo />
      </View>
    )
  }
}
