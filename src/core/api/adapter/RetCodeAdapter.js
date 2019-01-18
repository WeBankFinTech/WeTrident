import { CGIReturnCode } from '../../constants'
import { RET_CODE } from '../WeApi'

export default class RetCodeAdapter {
  static isProcessingState (retCode) {
    return (CGIReturnCode.CGI_PROCESSING === retCode || CGIReturnCode.CGI_PROCESSING_2 === retCode)
  }

  static isTransferSuccess (retCode) {
    return (CGIReturnCode.CGI_SUCCESS === retCode || CGIReturnCode.CGI_SUCCESS_2 === retCode)
  }

  static isWrongPassword (errCode) {
    return [
      CGIReturnCode.CGI_PWD_ERR_1,
      CGIReturnCode.CGI_PWD_ERR_2,
      CGIReturnCode.CGI_PWD_ERR_3,
      CGIReturnCode.CGI_PWD_ERR_4,
      CGIReturnCode.CGI_PWD_ERR_5,
      CGIReturnCode.CGI_PWD_ERR_6,
      CGIReturnCode.CGI_PWD_ERR_7,
      CGIReturnCode.CGI_PWD_ERR_1_2,
      CGIReturnCode.CGI_PWD_ERR_2_2,
      CGIReturnCode.CGI_PWD_ERR_3_2,
      CGIReturnCode.CGI_PWD_ERR_4_2,
      CGIReturnCode.CGI_PWD_ERR_5_2,
      CGIReturnCode.CGI_PWD_ERR_6_2,
      CGIReturnCode.CGI_PWD_ERR_7_2,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_1,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_2,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_3,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_4,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_5,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_6,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_7
    ].indexOf(errCode) !== -1
  }

  static isPasswordErrorOrTokenExpired (errCode) {
    return RetCodeAdapter.isWrongPassword(errCode) ||
      [RET_CODE.TOKEN_EXPIRED].indexOf(errCode) > -1
  }

  static isPasswordLocked (errCode) {
    return [
      CGIReturnCode.CGI_PWD_ERR_3,
      CGIReturnCode.CGI_PWD_ERR_6,
      CGIReturnCode.CGI_PWD_ERR_3_2,
      CGIReturnCode.CGI_PWD_ERR_6_2,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_4,
      CGIReturnCode.CGI_PWD_ERR_WMHJHTR_7
    ].indexOf(errCode) !== -1
  }

  static isWrongMtFund (errCode) {
    return CGIReturnCode.CGI_RET_TRANS_WRONG_MTFUND === errCode
  }
}
