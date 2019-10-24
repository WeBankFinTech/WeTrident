import React, { Component } from 'react'
import JSONTree from 'react-native-json-tree'

export default class extends Component {
  render () {
    const filtered = Object.keys(this.props)
      .filter(key => !['navigation', 'screenProps',].includes(key) && typeof this.props[key] !== 'function')
      .reduce((obj, key) => {
          obj[key] = this.props[key]
          return obj
        }, {}
      )
    return <JSONTree
      data={filtered}
      hideRoot />
  }
}
