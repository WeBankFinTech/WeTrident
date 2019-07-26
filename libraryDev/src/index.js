/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import { TridentApp } from '@webank/trident'

export default class AppEntry extends Component {
  render () {
    // All you need to setup
    return (
      <TridentApp
        navigationConfig={{
          navigationOptions: {
            gesturesEnabled: true,
            headerBackTitle: null,
            headerTitleAllowFontScaling: false,
            headerStyle: {
              borderWidth: 0,
              borderBottomWidth: 0,
              elevation: 0
            },
            headerTitleStyle: {
              fontWeight: 'normal',
              textAlign: 'center'
            }
          },
          headerMode: 'screen',
          cardStyle: {
            backgroundColor: 'red'
          }
        }}
        container={require('./container').default}
        modules={require('./modules').default} />
    )
  }
}
