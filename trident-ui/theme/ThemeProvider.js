import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ThemeProvider extends Component {
  static propTypes = {
    // children: PropTypes.element,
    theme: PropTypes.object
  }

  static childContextTypes = {
    theme: PropTypes.object.isRequired,
  }

  getChildContext () {
    console.log('getChildContext', this.props.theme)
    return {
      theme: this.props.theme
    }
  }

  render () {
    console.log('rerender ', 'ThemeProvider')
    return this.props.children
  }
}
