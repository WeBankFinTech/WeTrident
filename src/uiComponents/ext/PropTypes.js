/**
 * Created by erichua on 27/11/2017.
 *
 * 写这个如下原因
 * 1. React的React.PropTypes会警告, 因为后续版本会移除, 所以抽取这里，后面可以直接统一替换成 'prop-types', 只需要替换这里
 * 2. 扩展一些自己常用的类型
 * 3. View.propTypes 之类的也又新老版本问题，所以把他们也提出来
 *
 */
import {
  Text,
  ViewPropTypes
} from 'react-native'

import PropTypes from 'prop-types'
export default {
  // 第一类，框架隔离，框架的类型做一次转换
  ...PropTypes,
  viewPropTypesStyle: ViewPropTypes.style,
  textPropTypesStyle: Text.propTypes.style,

  // 第二类，业务无关扩展
  imageSource: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      uri: function (props, propName, componentName) {
        if (!isValidUrl(props[propName])) {
          return new Error(
            'Invalid prop `' + propName + '` supplied to' +
            ' `' + componentName + '`. imageSource.uri should be a valid uri.'
          )
        }
      }
    })
  ]),

  // 第三类，业务相关扩展类
  bankCard: PropTypes.shape({
    bankName: PropTypes.string, // 银行名称
    cardNo: PropTypes.string, // 卡号
    remark: PropTypes.string, // 卡备注
    cardType: PropTypes.string // 卡类型
  })
}

const isValidUrl = (string) => {
  try {
    return new URL(string)
  } catch (e) {
    return false
  }
}
