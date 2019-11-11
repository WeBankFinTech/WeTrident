import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createTheme from './createTheme'
import LightTheme from './LightTheme'
import _ from 'lodash'

export default class ThemeProvider extends Component {
  static propTypes = {
    // children: PropTypes.element,
    theme: PropTypes.object
  }

  static Theme = createTheme(LightTheme, {}).ThemeConst

  static childContextTypes = {
    theme: PropTypes.object.isRequired,
  }

  constructor () {
    super(...arguments)
  }

  componentWillReceiveProps (nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.theme
      && this.props.theme
      && nextProps.theme.ThemeConst
      && !_.isEqual(nextProps.theme.ThemeConst, ThemeProvider.Theme)) {
      console.log('prevProps.theme && this.props.theme && !_.isEqual(prevProps.theme, this.props.theme)')
      ThemeProvider.Theme = _.merge(ThemeProvider.Theme, nextProps.theme.ThemeConst)
    }
  }

  getChildContext () {
    return {
      theme: this.props.theme
    }
  }

  render () {
    return this.props.children
  }
}
