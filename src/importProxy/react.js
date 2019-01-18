/**
 * Created by erichua on 16/01/2018.
 */

import PropTypes from 'prop-types'
let React
if (process.env.NODE_ENV === 'production') {
  React = require('../../node_modules/react/cjs/react.production.min.js')
} else {
  React = require('../../node_modules/react/cjs/react.development.js')
}

React.PropTypes = PropTypes

module.exports = React
