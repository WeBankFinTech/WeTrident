import { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

export default class ThemeableComponent extends Component {
  static contextTypes = {
    theme: PropTypes.object.isRequired
  }

  themeStyleKeys = ['style']

  themeValueKeys = []

  getComponentTheme () {
    const theme = _.get(this.context, 'theme', {})
    if (this.namespace && _.isObject(theme[this.namespace])) {
      const styles = {};
      (this.themeStyleKeys || []).forEach(key => {
        styles[key] = [theme[this.namespace][key], this.context[key], this.props[key]]
      });
      (this.themeValueKeys || []).forEach(key => {
        styles[key] = this.props[key] || this.context[key] || theme[this.namespace][key]
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
}
