import React, { Component } from 'react'
import JSONTree from 'react-native-json-tree'
import { ScrollView } from 'react-native'

export default class extends Component {
  static defaultProps = {
    ignoreKeys: ['navigation', 'screenProps']
  }

  render () {
    const filtered = Object.keys(this.props)
      .filter(key => !this.props.ignoreKeys.includes(key)
        && !['ignoreKeys'].includes(key)
        && typeof this.props[key] !== 'function')
      .reduce((obj, key) => {
          obj[key] = this.props[key]
          return obj
        }, {}
      )
    return (
      <ScrollView>
        <JSONTree
          shouldExpandNode={() => true}
          data={filtered}
          hideRoot />
      </ScrollView>
    )
  }
}
