import React, { Component } from 'react'
import _ from 'lodash'

export default class ThemeableComponent extends Component {
  getComponentTheme () {
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
