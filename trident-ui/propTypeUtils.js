import PropTypes from 'prop-types'
import IconNames from './Icon/IconNames'

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.array,
  PropTypes.object
])

const iconNamePropType = PropTypes.oneOf(Object.values(IconNames))

export {
  stylePropType,
  iconNamePropType
}
