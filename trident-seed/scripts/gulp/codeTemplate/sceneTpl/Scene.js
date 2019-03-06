/**
 * 主要负责用户交互逻辑，
 * 用户的交互产生的状态数据通过actions记录到store上，
 * 获取后台的数据需要通过actions或者Service(取决于是否需要记录到store)，避免在Scene里面直接调用后台
 *
 * Created by {{author}} on {{createTime}}.
 */
import React, {Component} from 'react'
import {
  View,
  Text
} from 'react-native'
import connect from './actionsReducer'

// import PropTypes from 'prop-types'
// import {{serviceName}} from './{{serviceName}}'
// import { } from 'utils'
// import { } from 'plugins'
// import { WeUI, WeColors, dimens, WeStrings } from 'apps/webankPro/values'
// import { } from 'apps/webankPro/services'
// import { AppNavigator } from '@unpourtous/trident-core'
// import { } from 'apps/webankPro/constants'
// import { WeApi, CGI, ServerEnv, ServerPrefixType } from 'apps/webankPro/api'
// import { } from 'apps/webankPro/adapter'
// import { ReportKeys } from './constants'

class {{sceneName}} extends Component {
  static propTypes = {}

  componentDidMount () {

  }

  render () {
    return (
      <View>
        <Text>{{sceneName}}</Text>
      </View>
    )
  }
}

export default connect({{sceneName}})
