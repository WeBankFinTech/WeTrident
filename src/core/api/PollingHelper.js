import CGI from './CGI'
import WeApi from './WeApi'
import {OrderQueryRetVal} from '../constants'

/**
 * Created by erichua on 25/05/2017.
 */

export default class PollingHelper {
  static STATUS = {
    SUCCESS: 'success',
    FAIL: 'fail',
    RETRY: 'retry',
    RESERVE_SUCCESS: 'reserve_success'
  }
  static RET_STATUS = {
    SUCCESS: 'success',
    FAIL: 'fail',
    PROCESSING: 'processing',
    RESERVE_SUCCESS: 'reserve_success'
  }
  /**
   *
   * @param queryFunc 单次的查询方法
   * @param checkStatusFunc 返回三中状态，成功, 失败, 重试
   * @param retryCount 重试次数
   * @param retryGap 重试间隔
   * @returns {Promise}
   *       {
   *          retCode: PollingHelper.RET_STATUS.xxx,
   *          retData: response.ret_data,
   *          retMsg: response.ret_msg
   *        }
   */
  static startPolling (queryFunc, checkStatusFunc, retryCount = 5, retryGap = 2000) {
    let queryTimes = 0
    return new Promise((resolve, reject) => {
      const roundQuery = function (response) {
        queryTimes++

        let count
        if (retryCount) {
          count = retryCount
        } else {
          count = 5
        }
        if (queryTimes <= count) {
          setTimeout(queryWrapper, retryGap)
        } else {
          console.log('查询了次数到了')
          let defaultRetData = {
            ori_rtn_desc: response.ori_rtn_desc ? response.ori_rtn_desc : '处理失败'
          }
          reject({
            retCode: PollingHelper.RET_STATUS.PROCESSING,
            retData: (response && response.ret_data) ? response.ret_data : defaultRetData,
            retMsg: response ? response.ret_msg : '处理中'
          })
        }
      }
      const queryWrapper = function () {
        queryFunc().then(response => {
          const status = checkStatusFunc(response)
          if (status === PollingHelper.STATUS.SUCCESS) {
            resolve({
              retCode: PollingHelper.RET_STATUS.SUCCESS,
              retData: response.ret_data,
              retMsg: response.ret_msg
            })
          } else if (status === PollingHelper.STATUS.RESERVE_SUCCESS) {
            resolve({
              retCode: PollingHelper.RET_STATUS.RESERVE_SUCCESS,
              retData: response.ret_data,
              retMsg: response.ret_msg
            })
          } else if (status === PollingHelper.STATUS.FAIL) {
            reject({
              retCode: PollingHelper.RET_STATUS.FAIL,
              retData: response.ret_data,
              retMsg: response.ret_msg
            })
          } else if (status === PollingHelper.STATUS.RETRY) {
            roundQuery(response)
          } else {
            console.warn('checkStatusFunc returns unexpected status: ' + status)
            reject({
              retCode: PollingHelper.RET_STATUS.FAIL,
              retData: response.ret_data,
              retMsg: response.ret_msg
            })
          }
        }, error => {
          console.log(error)
          roundQuery(error)
        })
      }
      queryWrapper()
    })
  }

  /**
   * 查询订单交易状态
   * WeApi 接口返回处理中状态码时，可通过该方法轮询（最多5次）订单状态并返回
   * @param {object} param
   * @param {string|number} param.queryType 查询类型，参考{@link OrderQueryType}
   * @param {string} param.transSerialNo 交易流水号
   * @param {string} param.prodCode 产品代码，参考{@link ProductCode}
   */
  static queryOrderStatus ({ queryType, transSerialNo, prodCode }) {
    const queryFunc = () => {
      const params = {
        query_type: queryType,
        trans_serno: transSerialNo,
        prod_code: prodCode
      }
      const options = { cacheMaxAgeInMs: 0 }
      return WeApi.get(CGI.queryOrderStatus, params, null, options)
    }

    const parseStatusFunc = response => {
      if (!response || !response.ret_data) {
        return PollingHelper.STATUS.RETRY
      }

      const retStatus = parseInt(response.ret_data.trans_status)

      switch (retStatus) {
        case OrderQueryRetVal.CONFIRM_SUCCESS:  // fall through
        case OrderQueryRetVal.APPLY_SUCCESS:
          console.log('交易成功..流水号:' + transSerialNo)
          return PollingHelper.STATUS.SUCCESS
        case OrderQueryRetVal.CONFIRM_FAILED:   // fall through
        case OrderQueryRetVal.APPLY_FAILED:     // fall through
        case OrderQueryRetVal.TIMEOUT:          // fall through
        case OrderQueryRetVal.CANCELD:          // fall through
        case OrderQueryRetVal.TO_WEBANK_CARD:
          console.log('交易失败..流水号:' + transSerialNo)
          // 失败
          return PollingHelper.STATUS.FAIL
        default:
          // 仍在处理中状态
          console.log('交易仍在处理中，继续查询..流水号:' + transSerialNo)
          return PollingHelper.STATUS.RETRY
      }
    }

    return PollingHelper.startPolling(queryFunc, parseStatusFunc)
  }
}
