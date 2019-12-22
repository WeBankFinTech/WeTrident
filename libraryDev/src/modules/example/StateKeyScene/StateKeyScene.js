/**
 * 负责用户交互逻辑
 *
 * Created by lhtin on 2019-12-13T10:40:59.102Z.
 */
import React from 'react'
import { View } from 'react-native'
import { List, WeBaseScene } from '@webank/trident'
import PropTypes from 'prop-types'

export default class StateKeyScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'StateKeyScene'
  })

  static getSceneStateKey = (params) => (params.id)

  static propTypes = {
    // 产品id
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      })
    })
  }

  componentDidMount () {
    const serverData = {
      'prod-1': {
        prodName: 'WeTrident',
        feature: '可快速开发支持商业运营App的框架。'
      },
      'prod-2': {
        prodName: 'React',
        feature: '学一次，到处写。'
      }
    }
    const data = serverData[this.params.id]
    this.setSceneState({
      prodName: data.prodName,
      feature: data.feature
    })
  }

  render () {
    const {
      prodName,
      feature
    } = this.props
    return (
      <View>
        <List style={{ backgroundColor: '#fff' }}>
          <List.Item data={{
            label: '名称',
            status: prodName
          }}
          />
          <List.Item data={{
            label: '特性',
            status: feature
          }}
          />
        </List>
      </View>
    )
  }
}
