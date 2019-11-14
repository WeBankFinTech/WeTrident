/**
 * Created by erichua on 24/04/2018.
 */
import _ from 'lodash'

export default class RenderUtils {
  /**
   * 简化undefined, null, object的判断
   * undefined 还没有值，
   * null 失败了
   * value 有值
   */
  static switch (options = []) {
    for (let i = 0; i < options.length; i++) {
      if (options[i][0]) {
        if (_.isFunction(options[i][1])) {
          return options[i][1]()
        } else {
          return options[i][1]
        }
      }
    }
    return undefined
  }
}
