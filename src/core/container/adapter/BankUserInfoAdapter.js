import { BindCardStatus } from '../../constants/AccountType'
import _ from 'lodash'

export default class BankUserInfoAdapter {
  /**
   * 合并卡备注
   * @param rawResponse
   * @returns {*}
   */
  static mergeCardRemark (rawResponse) {
    if (!rawResponse || !rawResponse.ret_data) {
      return {}
    }
    let rawRetData = _.cloneDeep(rawResponse.ret_data)
    if (!rawRetData.bind_cards_list) {
      return rawRetData
    }
    const bankCardList = [] // 绑定卡
    const unBindCardList = [] // 主动解绑过的卡
    const unBindCardListPassive = [] // 被动解绑的卡，审核不通过
    for (let i = 0; i < rawRetData.bind_cards_list.length; i++) {
      if (rawRetData.bind_cards_list[i].status === BindCardStatus.VALID) {
        let cardNo = rawRetData.bind_cards_list[i].other_account
        if (rawRetData.bank_card_remarks) {
          let cardRemark = rawRetData.bank_card_remarks.find((item) => {
            return item.bank_no === cardNo
          })
          rawRetData.bind_cards_list[i].card_remark = cardRemark || {}
        } else {
          rawRetData.bind_cards_list[i].card_remark = {}
        }

        bankCardList.push({
          ...rawRetData.bind_cards_list[i]
        })
      } else if (rawRetData.bind_cards_list[i].status === BindCardStatus.INVALID) {
        let cardNo = rawRetData.bind_cards_list[i].other_account
        if (rawRetData.bank_card_remarks) {
          let cardRemark = rawRetData.bank_card_remarks.find((item) => {
            return item.bank_no === cardNo
          })
          rawRetData.bind_cards_list[i].card_remark = cardRemark || {}
        } else {
          rawRetData.bind_cards_list[i].card_remark = {}
        }

        unBindCardList.push({
          ...rawRetData.bind_cards_list[i]
        })
      } else if (rawRetData.bind_cards_list[i].status === BindCardStatus.OTHER_INVALID) {
        let cardNo = rawRetData.bind_cards_list[i].other_account
        if (rawRetData.bank_card_remarks) {
          let cardRemark = rawRetData.bank_card_remarks.find((item) => {
            return item.bank_no === cardNo
          })
          rawRetData.bind_cards_list[i].card_remark = cardRemark || {}
        } else {
          rawRetData.bind_cards_list[i].card_remark = {}
        }

        unBindCardListPassive.push({
          ...rawRetData.bind_cards_list[i]
        })
      }
    }
    rawRetData.bind_cards_list = bankCardList
    rawRetData.unbind_cards_list = unBindCardList
    rawRetData.unbind_cards_list_passive = unBindCardListPassive
    return rawRetData
  }

  static _findRemarkByCardNo (cardNo) {

  }
}
