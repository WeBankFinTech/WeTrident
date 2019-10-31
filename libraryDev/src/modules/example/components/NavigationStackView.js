import React, { Component } from 'react'
import { Text } from 'react-native'
import { List, L } from '@webank/trident/trident-ui'
import PropTypes from 'prop-types'

export default class extends Component {
  static defaultProps = {
    ignoreKeys: ['navigation', 'screenProps'],
    routes: PropTypes.array
  }

  render () {
    let { routes = [] } = this.props
    if (routes === null) {
      routes = []
    }
    return (
      <L.Column.MainStart.CrossStart style={{
        paddingHorizontal: 16
      }}>
        <Text style={{
          fontSize: 16,
          marginTop: 16
        }}>Navigation Stack</Text>
        <List style={{
          flex: 1,
          alignSelf: 'stretch',
          marginTop: 8
        }}>
          {[...routes].reverse().map((item, index) => {
            return <Text key={'key' + index} style={{ paddingVertical: 4 }}>{routes.length - index - 1}. {item.routeName}</Text>
          })}
        </List>
      </L.Column.MainStart.CrossStart>
    )
  }
}
