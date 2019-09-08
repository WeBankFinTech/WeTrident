import React, { Component } from 'react'
import { View } from 'react-native'

export default class EntryList extends Component {
  render () {
    return (
      <View style={{
        flexDirection: 'column',
        paddingHorizontal: 20
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
