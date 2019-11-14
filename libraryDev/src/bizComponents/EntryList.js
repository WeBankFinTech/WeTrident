import React, { Component } from 'react'
import { View } from 'react-native'
import _ from 'lodash'

export default class EntryList extends Component {
  render () {
    if (!_.isArray(this.props.children)) {
      return (
        <View style={{
          marginVertical: 10,
          paddingHorizontal: 16
        }}>
          {this.props.children}
        </View>
      )
    }
    return (
      <View style={{
        flexDirection: 'column',
        paddingHorizontal: 16
      }}>
        {this.props.children.map((child, index) => {
          return <View key={'i' + index} style={{
            marginVertical: 10
          }}>
            {child}
          </View>
        })}
      </View>
    )
  }
}
