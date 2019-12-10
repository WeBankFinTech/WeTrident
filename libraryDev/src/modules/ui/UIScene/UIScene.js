/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:22:42.484Z.
 */
import React from 'react'
import { View } from 'react-native'

import { WeBaseScene } from '@webank/trident'

export default class UIScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'UIScene'
  })

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
      </View>
    )
  }
}
