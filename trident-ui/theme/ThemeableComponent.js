import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

export default class ThemeableComponent extends Component {
  static contextTypes = {
    theme: PropTypes.object.isRequired
  }

  getComponentTheme () {
    const theme = _.get(this.context, 'theme', {})
    if (this.namespace && _.isObject(theme[this.namespace])) {
      const styles = {};
      (this.themeStyleKeys || []).forEach(key => {
        // Table.Tr:
        // {
        //
        // }
        // Table.Td: {}
        styles[key] = [theme[this.namespace][key], this.context[key], this.props[key]]
      })
      return {
        theme: {},
        ...this.props,
        ...styles
      }
    }
    return {
      theme: {},
      ...this.props
    }
  }

  _mergeTheme (customComponentTheme = {}) {
    return {
      theme: {
        ...customComponentTheme,
      },
      context: {
        ...this.context,
      },
      ...(this.props || {}),
    }
  }

  render () {
    return null
  }
}
