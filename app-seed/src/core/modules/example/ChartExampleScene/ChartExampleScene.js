/**
 * 主要负责用户交互逻辑，
 * 用户的交互产生的状态数据通过actions记录到store上，
 * 获取后台的数据需要通过actions或者Service(取决于是否需要记录到store)，避免在Scene里面直接调用后台
 *
 * Created by sines on 2018-02-23T10:25:07.640Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import WeTouchable from '@unpourtous/react-native-touchable/library/WeTouchable'

// import PropTypes from 'prop-types'
// import ChartExampleService from './ChartExampleService'
import { AppNavigator } from '@unpourtous/trident'

export default class ChartExampleScene extends Component {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || ''
  })

  render () {
    const {
      props: {
        count,
        moduleCount,
        globalCount,

        addCount,
        addModuleCount,
        addGlobalCount,

        // TODO 这样直接放出来，会导致 navigatoion 下面的方法被滥用
        navigation: {
          setParams,
          getParams
        }
      },
    } = this
    return <View>
      <WeTouchable onPress={() => {
        AppNavigator.example.ChartExampleScene()
      }}>
        <Text>Test Jump</Text>
      </WeTouchable>

      <WeTouchable onPress={() => {
        addCount(1)
        addModuleCount(5)
        addGlobalCount(10)

        setParams({title: 'Custom Title' + globalCount})
      }}>
        <Text>Scene Count {count}</Text>
        <Text>Module Count {moduleCount}</Text>
        <Text>Global Count {globalCount}</Text>
      </WeTouchable>

    </View>
  }
}
