import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

export default class ThemeableComponent extends Component {
  static contextTypes = {
    theme: PropTypes.object.isRequired
  }

  getComponentTheme () {
    console.log('this.context', this.context)
    const theme = _.get(this.context, 'theme')
    if (this.namespace && _.isObject(theme[this.namespace])) {
      return this._mergeTheme(theme[this.namespace])
    }
    return this.props
  }

  _mergeTheme (customComponentTheme = {}) {
    return {
      ...customComponentTheme,
      ...(this.props || {}),
    }
  }

  render () {
    return null
  }
}
