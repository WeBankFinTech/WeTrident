/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import AppContainer from './container/AppContainer'
import WeNavigator, { navReduxMiddleware } from '../library/navigation/WeNavigator'
import reducer from './reducer'
import Trident from '../library/Trident'
import { AppNavigator } from '../library/navigation'

export default class AppEntry extends Component {
  static propTypes = {}

  constructor (props) {
    super(props)
  }

  render () {
    // All you need to setup
    return (
      <Trident
        entryScene={AppNavigator.example.ChartExampleScene.toString()}
        reducer={reducer}>
        <AppContainer initProps={{ ...this.props }}>
          <WeNavigator/>
        </AppContainer>
      </Trident>
    )
  }
}
