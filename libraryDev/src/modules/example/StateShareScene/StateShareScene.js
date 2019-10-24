/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T02:40:57.927Z.
 */
import React from 'react'
import { Text } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import ObjectView from '../components/ObjectView'
import { L } from '@webank/trident/trident-ui'

export default class StateShareScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'StateShareScene'
  })

  render () {
    const {
      moduleCount,
      globalCount
    } = this.props
    return (
      <L.Column style={{ flex: 1 }}>
        <L.Column.MainCenter.CrossCenter style={{ flex: 1 }}>
          <Text style={{ fontSize: 20 }}>moduleCount(Share between module): <Text
            style={{ color: 'green' }}>{moduleCount}</Text></Text>
          <Text style={{ fontSize: 20, marginTop: 30 }}>globalCount(Share global): <Text
            style={{ color: 'green' }}>{globalCount}</Text></Text>
        </L.Column.MainCenter.CrossCenter>
        <ObjectView {...this.props} />
      </L.Column>
    )
  }
}
