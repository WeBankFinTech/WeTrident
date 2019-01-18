import { Filters } from 'utils'
import { MonetaryFundService, AssetService } from 'apps/webankPro/services'
import { ProdInfo } from 'apps/webankPro/services/index'
import { DepositType } from 'apps/webankPro/constants'
import Decimal from 'decimal.js'

export default class WealthV3Adapter {
  static parseRawWealth (rawResponse = {}, isUseWealthV4 = false, rawUserWealthV3) {
    if (!rawResponse && !rawResponse.ret_data) {
      return {}
    }
    if (isUseWealthV4) {
      return {
        ...rawResponse.ret_data,
        finance_wealth: {
          ...rawResponse.ret_data.finance_wealth,
          webank_card_cycle: rawUserWealthV3.finance_wealth.webank_card_cycle
        }
      }
    } else {
      return rawResponse.ret_data
    }
  }
  /**
   * 资产解析
   *
   * @static
   * @param {Object} rawResponse - 通过 query/wealth/all/v3 接口请求返回的数据
   * @returns {Object} 解析后的资产数据，格式如下：
   * @memberof WealthV3Adapter
   */
  static parseWealth (rawResponse, isUseWealthV4 = false) {
    if (!rawResponse && !rawResponse.ret_data) {
      return {}
    }
    const rawWealthData = rawResponse.ret_data
    const {amount_distribution, core_account} = rawWealthData
    const {
      principalDeposit,
      intelliDeposit,
      intelliPlusDeposit,
      timeDeposit,
      structureDeposit,
      confirmingDeposit,
      CDeposit,
      totalDepositNum,
      depositByCode
    } = isUseWealthV4 ? parseDepositWealthV2(rawWealthData) : parseDepositWealth(rawWealthData)
    const {
      webankCardFreezeAmount,
      timeDepositFreezeAmount,
      intelliDepositFreezeAmount,
      principalDepositFreezeAmount,
      cDepositFreezeAmount,
      totalDepositFreezeAmount,
      totalFreezeAmount
    } = isUseWealthV4 ? calcFreezeAmountV2(rawWealthData) : calcFreezeAmount(rawWealthData)
    const {securityDeposits, securityAmount} = parseSecurityWealth(rawWealthData)
    const goldWealth = parseGoldWealth(rawWealthData)

    const availableWebankAmount = parseFloat(core_account.available_amount)
    let availableBalanceAmount = MonetaryFundService.getAvailableAmount(MonetaryFundService.getHoldingProdCode(rawWealthData), rawWealthData)

    // 银行存款（智能存款、定期存款、存本取息、大额存单、结构性存款）
    const depositTotalAmount = new Decimal(0)
      .add(intelliDeposit.totalAmount)
      .add(principalDeposit.totalAmount)
      .add(timeDeposit.totalAmount)
      .add(structureDeposit.totalAmount)
      .add(confirmingDeposit.totalAmount)
      .add(CDeposit.totalAmount)
      .toNumber()
    const depositAvailableAmount = new Decimal(0)
      .add(intelliDeposit.availableTotalAmount)
      .add(principalDeposit.availableTotalAmount)
      .add(timeDeposit.availableTotalAmount)
      .add(structureDeposit.availableTotalAmount)
      .add(CDeposit.availableTotalAmount)
      .toNumber()

    // 智能存款+
    const intelliDepositPlusTotalAmount = new Decimal(0)
      .add(intelliPlusDeposit.totalAmount)
      .toNumber()
    const intelliDepositPlusAvailabeAmount = new Decimal(0)
      .add(intelliPlusDeposit.availableTotalAmount)
      .toNumber()

    const depositAmount = new Decimal(0)
      .add(depositTotalAmount)
      .add(intelliDepositPlusTotalAmount)
      .toNumber()
    const availableDepositAmount = new Decimal(0)
      .add(depositAvailableAmount)
      .add(intelliDepositPlusAvailabeAmount)
      .toNumber()

    ProdInfo.preLoadWealthProdInfo(rawWealthData, true).catch(error => { console.log(error) })
    return {
      // 总资产
      totalAmount: amount_distribution.total_amount,
      // 可用的总资产，不包括冻结资产
      availableTotalAmount: new Decimal(0).add(availableWebankAmount).add(availableBalanceAmount).toNumber(),
      // 活期+总资产（货基）
      balanceAmount: amount_distribution.balance_amount,
      // 可用的活期+总资产（货基），不包括冻结资金
      availableBalanceAmount: availableBalanceAmount,
      // 微众卡总资产
      webankAmount: amount_distribution.webank_amount,
      // 可用的微众卡总资产，不包括冻结资金
      availableWebankAmount: availableWebankAmount,
      // We通卡资产
      wecardAmount: amount_distribution.wecard_amount,
      // 存款总资产
      depositAmount,
      // 可用存款总资产，不包含冻结资金
      availableDepositAmount,
      // 基金总资产（股基）
      fundAmount: amount_distribution.fund_amount,
      // 微众金总资产（金额）
      goldAmount: amount_distribution.gold_amount,
      // 微众金重量（克数）小数4位以后的舍掉，最后一笔卖出时后台会自动判断账户是否还有小数以后五位的资产，如果有会一起卖出
      goldWeight: Filters.floor(amount_distribution.gold_weight, 4),
      // 第三方保险总资产（年金险）
      insuranceAmount: amount_distribution.insurance_amount,
      // 定期+（大于等于30天的定期） 资产
      fixTimeWealth: {
        totalAmount: amount_distribution.long_finance_amount
      },
      // 短期+总资产（小于30天的定期）
      shortTermWealth: {
        totalAmount: amount_distribution.short_finance_amount
      },
      // 保证金资产
      securityWealth: {
        amount: securityAmount,
        deposits: securityDeposits
      },

      // 结构化产品总资产
      structureAmount: amount_distribution.structure_amount,
      // 按code分类的存款资产
      depositByCode,
      // 定期存款
      depositWealth: {
        // 资产总额（包含冻结的存款）
        totalAmount: depositAmount,
        availabelTotalAmount: availableDepositAmount,
        totalDepositNum, // 存单总数量
        depositTotalAmount,
        depositAvailableAmount,
        intelliDepositPlusTotalAmount,
        intelliDepositPlusAvailabeAmount,
        // 所有存单
        items: [
          ...principalDeposit.items,
          ...intelliDeposit.items,
          ...intelliPlusDeposit.items,
          ...timeDeposit.items,
          ...structureDeposit.items,
          ...CDeposit.items
        ],
        // 存本取息存款
        principalDeposit,
        // 智能存款
        intelliDeposit,
        // 智能存款+
        intelliPlusDeposit,
        // 定期存款
        timeDeposit,
        // 结构性存款
        structureDeposit,
        // 在途的产品
        confirmingDeposit,
        // 大额存单
        CDeposit
      },
      // 黄金
      goldWealth,
      // 冻结金额分布
      freezeWealth: {
        webankCardFreezeAmount,
        timeDepositFreezeAmount,
        intelliDepositFreezeAmount,
        principalDepositFreezeAmount,
        cDepositFreezeAmount,
        totalDepositFreezeAmount,
        totalFreezeAmount
      }
    }
  }
  /**
   * 解析基金自资产数据
   * @param rawData
   * @param prodCode
   * @return {{}}
   */
  static parseFundWealthByCode (rawData, prodCode) {
    var productWealthData = {}
    productWealthData.income = parseFloat(0).toFixed(2)
    productWealthData.accumulatedIncome = parseFloat(0).toFixed(2)
    productWealthData.amount = parseFloat(0).toFixed(2)
    productWealthData.ownAmount = 0 // 所有持有资产
    productWealthData.buyInTrans = 0 // 申购在途
    productWealthData.share = parseFloat(0).toFixed(2)
    productWealthData.totalShare = parseFloat(0).toFixed(2)
    productWealthData.realValue = parseFloat(0).toFixed(4)
    productWealthData.bonusType = 1
    productWealthData.refundAmount = 0

    productWealthData.cashDivInTrans = 0// 现金分红金额在途
    productWealthData.volDivInTrans = 0// 红利再投份额在途
    productWealthData.exDividendDate = null// 除息日
    productWealthData.payDividendDate = null// 派息日
    productWealthData.dividendPerTax = 0// 每股分红

    productWealthData.transDate = '20160505' // 购买时间
    productWealthData.transTime = '050505' // 购买时间

    if (rawData && rawData.finance_wealth && rawData.finance_wealth.fund_cycle) {
      for (var i in rawData.finance_wealth.fund_cycle) {
        var product = rawData.finance_wealth.fund_cycle[i]
        if (product.prod_code !== prodCode) {
          continue
        }

        // 退款
        if (product.refund_amount && product.refund_amount > 0) {
          productWealthData.ownAmount += parseFloat(product.refund_amount)
        }

        // 赎回在途
        if (product.redeem_in_trans_confirming > 0) {
          productWealthData.ownAmount += parseFloat(product.redeem_in_trans_confirming) * parseFloat(product.net_value)
        }

        // 赎回确认
        if (product.redeem_in_trans_confirmed > 0) {
          productWealthData.ownAmount += parseFloat(product.redeem_in_trans_confirmed)
        }

        // 申购在途
        if (product.buy_in_trans > 0) {
          productWealthData.ownAmount += parseFloat(product.buy_in_trans)
          productWealthData.buyInTrans += parseFloat(product.buy_in_trans)
        }

        // 分红会被算进赎回金额在途里面，所以这里不需要再对持有的资产进行计算
        // 现金分红在途
        if (product.cash_div_in_trans > 0) {
          productWealthData.cashDivInTrans += parseFloat(product.cash_div_in_trans)
        }

        // 红利再投在途
        if (product.vol_div_in_trans > 0) {
          productWealthData.volDivInTrans += parseFloat(product.vol_div_in_trans)
        }

        // 除息日
        if (product.ex_dividend_date) {
          productWealthData.exDividendDate = product.ex_dividend_date
        }

        // 派息日
        if (product.pay_dividend_date) {
          productWealthData.payDividendDate = product.pay_dividend_date
        }

        // 每股分红
        if (product.dividend_per_tax > 0) {
          productWealthData.dividendPerTax = product.dividend_per_tax
        }

        // 持有
        if (product.available_vol > 0) {
          productWealthData.ownAmount += parseFloat(product.available_vol) * parseFloat(product.net_value)
        }

        productWealthData.income = parseFloat(0).toFixed(2) // 昨日盈亏，数据无效
        productWealthData.accumulatedIncome = parseFloat(0).toFixed(2) // 累计盈亏，数据无效
        productWealthData.amount = (parseFloat(product.available_vol) * parseFloat(product.net_value)).toFixed(2) // 可用市值，去掉了赎回冻结的
        productWealthData.share = parseFloat(product.available_vol).toFixed(2) // 持有份额，去掉了赎回冻结的
        productWealthData.totalShare = parseFloat(product.total_vol) // 总份额（持有份额＋冻结份额）
        productWealthData.realValue = parseFloat(product.net_value) // 净值
        productWealthData.bonusType = product.dividend_method      // 分红方式
        productWealthData.pledgeBonusType = product.pledge_dividendmethod   // (质押贷)分红方式

        if (product.refund_amount && product.refund_amount > 0) {
          productWealthData.refundAmount = parseFloat(product.refund_amount).toFixed(2) // 退款中金额
        }

        return productWealthData
      }
    }

    return productWealthData
  }
}
const getMergeDepositByCode = (wealth, item, count) => {
  if (wealth === undefined) {
    wealth = {
      totalAmount: 0,
      availableAmount: 0,
      count: 0
    }
  }
  wealth.count += count
  wealth.totalAmount = new Decimal(wealth.totalAmount).add(item.account_balance).toNumber()
  wealth.availableAmount = new Decimal(wealth.availableAmount).add(item.available_balance).toNumber()
  return wealth
}
/**
 * 解析存款资产数据
 * @param {Object} rawWealth - 资产接口返回的原始资产数据
 */
const parseDepositWealth = (rawWealth) => {
  let webankCardCycle, systemTime, systemTimeStr
  try {
    webankCardCycle = rawWealth.finance_wealth.webank_card_cycle

    if (rawWealth.finance_wealth.system_time) {
      systemTimeStr = rawWealth.finance_wealth.system_time

      if (systemTimeStr) {
        var yr = parseInt(systemTimeStr.substring(0, 4), 10)
        var mon = parseInt(systemTimeStr.substring(4, 6), 10)
        var dt = parseInt(systemTimeStr.substring(6, 8), 10)

        systemTime = new Date(yr, mon - 1, dt)
      }
    }
    if (!Array.isArray(webankCardCycle)) throw new Error()
  } catch (err) {
    throw new Error('parse deposit asset failed')
  }

  const principalDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const intelliDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const intelliPlusDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const timeDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const structureDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const confirmingDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const CDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  // 按照code累积资产，目前只有智能存款+在里面
  const depositByCode = {}
  if (webankCardCycle.length === 0) {
    return {
      principalDeposit,
      intelliDeposit,
      intelliPlusDeposit,
      timeDeposit,
      structureDeposit,
      confirmingDeposit,
      CDeposit
    }
  }

  webankCardCycle.forEach(item => {
    // 首先把在途的归集
    if (item.comfirm_status && item.comfirm_status === 'COMFIRMING') {
      confirmingDeposit.items.push(item)
    }
    // 过滤
    if (item.account_status !== 'A') return

    /**
     * 00--普通活期 01--整存整取 02--定活两便 03--存本取息 04--零存整取 05--通知存款 06--教育储蓄 07--整存零取 08--协议存款 09--协定存款
     * 10--通知理财 11--对公活期 12--对公整存整取 13--对公通知存款 14--对公活期保证金 15--对公定期保证金 16--对私活期保证金 17--对私定期保证金
     * 18--同业活期存款 19--同业定期存款 20--同业通知存款 21--财政存款 22--对公理财 23--同业活期保证金 24--同业定期保证金 25--对私理财 28--结构性存款 30--大额存单
     */
    switch (item.deposit_type) {
      case '01':  // 定期存款
        timeDeposit.items.push(item)
        break
      case '02':  // 智能存款
        if (AssetService.isIntelliPlusAsset(item.deposit_type, item.prod_code)) {
          intelliPlusDeposit.items.push(item)
          depositByCode[item.prod_code] = getMergeDepositByCode(depositByCode[item.prod_code], item, 1)
        } else {
          intelliDeposit.items.push(item)
        }
        break
      case '03':  // 存本取息存款
        principalDeposit.items.push(item)
        break
      case '28':  // 结构性存款
        structureDeposit.items.push(item)
        break
      case DepositType.C_DEPOSIT:
        CDeposit.items.push(item)
        break
    }
  })

  principalDeposit.totalAmount = principalDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  principalDeposit.availableTotalAmount = principalDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)
  intelliDeposit.totalAmount = intelliDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  intelliDeposit.availableTotalAmount = intelliDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)

  intelliPlusDeposit.totalAmount = intelliPlusDeposit.items.reduce((pre, cur) =>
    new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  intelliPlusDeposit.availableTotalAmount = intelliPlusDeposit.items.reduce((pre, cur) =>
    new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)

  timeDeposit.totalAmount = timeDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  timeDeposit.availableTotalAmount = timeDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)
  structureDeposit.totalAmount = structureDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  structureDeposit.availableTotalAmount = structureDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)
  confirmingDeposit.totalAmount = confirmingDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0) // 在途只返回一个金额
  CDeposit.totalAmount = CDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.account_balance).toNumber(), 0)
  CDeposit.availableTotalAmount = CDeposit.items.reduce((pre, cur) => new Decimal(0).add(pre).add(cur.available_balance).toNumber(), 0)

  return {
    depositByCode,
    principalDeposit,
    intelliDeposit,
    intelliPlusDeposit,
    timeDeposit,
    structureDeposit,
    confirmingDeposit,
    CDeposit
  }
}

const parseDepositWealthV2 = (rawWealth) => {
  let webankCardCycle, systemTime, systemTimeStr
  try {
    webankCardCycle = rawWealth.finance_wealth.deposit_prod_cycle || []

    if (rawWealth.finance_wealth.system_time) {
      systemTimeStr = rawWealth.finance_wealth.system_time

      if (systemTimeStr) {
        var yr = parseInt(systemTimeStr.substring(0, 4), 10)
        var mon = parseInt(systemTimeStr.substring(4, 6), 10)
        var dt = parseInt(systemTimeStr.substring(6, 8), 10)

        systemTime = new Date(yr, mon - 1, dt)
      }
    }
    if (!Array.isArray(webankCardCycle)) throw new Error()
  } catch (err) {
    throw new Error('parse deposit asset failed')
  }
  let totalDepositNum = 0
  const principalDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const intelliDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const intelliPlusDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const timeDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const structureDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const confirmingDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  const CDeposit = {
    totalAmount: 0,
    availableTotalAmount: 0,
    systemTime: systemTime,
    items: []
  }
  // 按照code累积资产，目前只有智能存款+在里面
  const depositByCode = {}
  if (webankCardCycle.length === 0) {
    return {
      principalDeposit,
      intelliDeposit,
      intelliPlusDeposit,
      timeDeposit,
      structureDeposit,
      confirmingDeposit,
      CDeposit
    }
  }

  webankCardCycle.forEach(item => {
    // 首先把在途的归集
    if (item.comfirm_status && item.comfirm_status === 'COMFIRMING') {
      confirmingDeposit.items.push(item)
    }
    if (item.deposit_type === DepositType.C_DEPOSIT ||
      item.deposit_type === DepositType.REGULAR ||
      item.deposit_type === DepositType.INTELLIGENT ||
      item.deposit_type === DepositType.PRINCIPAL ||
      item.deposit_type === DepositType.STRUCTURE) {
      totalDepositNum += item.total_records
    }

    /**
     * 00--普通活期 01--整存整取 02--定活两便 03--存本取息 04--零存整取 05--通知存款 06--教育储蓄 07--整存零取 08--协议存款 09--协定存款
     * 10--通知理财 11--对公活期 12--对公整存整取 13--对公通知存款 14--对公活期保证金 15--对公定期保证金 16--对私活期保证金 17--对私定期保证金
     * 18--同业活期存款 19--同业定期存款 20--同业通知存款 21--财政存款 22--对公理财 23--同业活期保证金 24--同业定期保证金 25--对私理财 28--结构性存款 30--大额存单
     */
    switch (item.deposit_type) {
      case '01':  // 定期存款
//        timeDeposit.items.push(item)
        timeDeposit.totalAmount = new Decimal(0).add(timeDeposit.totalAmount).add(item.account_balance).toNumber()
        timeDeposit.availableTotalAmount = new Decimal(0).add(timeDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        break
      case '02':  // 智能存款
        if (AssetService.isIntelliPlusAsset(item.deposit_type, item.prod_code)) {
//          intelliPlusDeposit.items.push(item)
          intelliPlusDeposit.totalAmount = new Decimal(0).add(intelliPlusDeposit.totalAmount).add(item.account_balance).toNumber()
          intelliPlusDeposit.availableTotalAmount = new Decimal(0).add(intelliPlusDeposit.availableTotalAmount).add(item.available_balance).toNumber()

          // 按照code整合
          depositByCode[item.prod_code] = getMergeDepositByCode(depositByCode[item.prod_code], item, item.total_records)
        } else {
//          intelliDeposit.items.push(item)
          intelliDeposit.totalAmount = new Decimal(0).add(intelliDeposit.totalAmount).add(item.account_balance).toNumber()
          intelliDeposit.availableTotalAmount = new Decimal(0).add(intelliDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        }
        break
      case '03':  // 存本取息存款
//        principalDeposit.items.push(item)
        principalDeposit.totalAmount = new Decimal(0).add(principalDeposit.totalAmount).add(item.account_balance).toNumber()
        principalDeposit.availableTotalAmount = new Decimal(0).add(principalDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        break
      case '28':  // 结构性存款
        if (!item.comfirm_status || item.comfirm_status !== 'COMFIRMING') {
          structureDeposit.totalAmount = new Decimal(0).add(structureDeposit.totalAmount).add(item.account_balance).toNumber()
          structureDeposit.availableTotalAmount = new Decimal(0).add(structureDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        } else if (item.comfirm_status && item.comfirm_status === 'COMFIRMING') {
          confirmingDeposit.totalAmount = new Decimal(0).add(confirmingDeposit.totalAmount).add(item.account_balance).toNumber()
          confirmingDeposit.availableTotalAmount = new Decimal(0).add(confirmingDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        }
//        structureDeposit.items.push(item)
        break
      case DepositType.C_DEPOSIT:
//        CDeposit.items.push(item)
        CDeposit.totalAmount = new Decimal(0).add(CDeposit.totalAmount).add(item.account_balance).toNumber()
        CDeposit.availableTotalAmount = new Decimal(0).add(CDeposit.availableTotalAmount).add(item.available_balance).toNumber()
        break
    }
  })

  return {
    depositByCode,
    principalDeposit,
    intelliDeposit,
    intelliPlusDeposit,
    timeDeposit,
    structureDeposit,
    confirmingDeposit,
    CDeposit,
    totalDepositNum
  }
}
/**
 * 计算冻结部分金额分布
 */
const calcFreezeAmount = (wealthData = {}) => {
  let webankCardFreezeAmount = 0
  let timeDepositFreezeAmount = 0
  let intelliDepositFreezeAmount = 0
  let principalDepositFreezeAmount = 0
  let cDepositFreezeAmount = 0

  if (wealthData.finance_wealth && (wealthData.finance_wealth.webank_card_cycle instanceof Array)) {
    for (let i = 0; i < wealthData.finance_wealth.webank_card_cycle.length; ++i) {
      let prod = wealthData.finance_wealth.webank_card_cycle[i]
      // 使用account_balance即包含冻结部分
      if (prod && prod.deposit_type === '01' && prod.account_status === 'A') { // 定期存款
        timeDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '02' && prod.account_status === 'A') { // 智能存款
        intelliDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '03' && prod.account_status === 'A') { // 存本取息
        principalDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '30' && prod.account_status === 'A') { // 大额存单
        cDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      }
    }
  }

  let coreAccount = wealthData.core_account
  if (coreAccount && coreAccount.freezing_list) {
    for (let item of coreAccount.freezing_list) {
      if (item.freezing_code === '22' && item.reason === 'tplusone') {
        // 微众卡合并付款(活期+T+1)转账冻结
        webankCardFreezeAmount += parseFloat(item.amout)
      }
    }
  }

  return {
    webankCardFreezeAmount,
    timeDepositFreezeAmount,
    intelliDepositFreezeAmount,
    principalDepositFreezeAmount,
    cDepositFreezeAmount,
    totalDepositFreezeAmount: new Decimal(0)
    .add(timeDepositFreezeAmount)
    .add(intelliDepositFreezeAmount)
    .add(cDepositFreezeAmount)
    .add(principalDepositFreezeAmount),

    totalFreezeAmount: new Decimal(0)
    .add(webankCardFreezeAmount)
    .add(timeDepositFreezeAmount)
    .add(intelliDepositFreezeAmount)
    .add(cDepositFreezeAmount)
    .add(principalDepositFreezeAmount)
  }
}
const calcFreezeAmountV2 = (wealthData = {}) => {
  let webankCardFreezeAmount = 0
  let timeDepositFreezeAmount = 0
  let intelliDepositFreezeAmount = 0
  let principalDepositFreezeAmount = 0
  let cDepositFreezeAmount = 0

  if (wealthData.finance_wealth && (wealthData.finance_wealth.deposit_prod_cycle instanceof Array)) {
    for (let i = 0; i < wealthData.finance_wealth.deposit_prod_cycle.length; ++i) {
      let prod = wealthData.finance_wealth.deposit_prod_cycle[i]
      // 使用account_balance即包含冻结部分
      if (prod && prod.deposit_type === '01') { // 定期存款
        timeDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '02') { // 智能存款
        intelliDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '03') { // 存本取息
        principalDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      } else if (prod && prod.deposit_type === '30') { // 大额存单
        cDepositFreezeAmount += Number(prod.account_balance - prod.available_balance)
      }
    }
  }

  let coreAccount = wealthData.core_account
  if (coreAccount && coreAccount.freezing_list) {
    for (let item of coreAccount.freezing_list) {
      if (item.freezing_code === '22' && item.reason === 'tplusone') {
        // 微众卡合并付款(活期+T+1)转账冻结
        webankCardFreezeAmount += parseFloat(item.amout)
      }
    }
  }

  return {
    webankCardFreezeAmount,
    timeDepositFreezeAmount,
    intelliDepositFreezeAmount,
    principalDepositFreezeAmount,
    cDepositFreezeAmount,
    totalDepositFreezeAmount: new Decimal(0)
    .add(timeDepositFreezeAmount)
    .add(intelliDepositFreezeAmount)
    .add(cDepositFreezeAmount)
    .add(principalDepositFreezeAmount),

    totalFreezeAmount: new Decimal(0)
    .add(webankCardFreezeAmount)
    .add(timeDepositFreezeAmount)
    .add(intelliDepositFreezeAmount)
    .add(cDepositFreezeAmount)
    .add(principalDepositFreezeAmount)
  }
}
/**
 * 保证金
 * @param  {Objct} rawWealth 资产元数据
 * @return {Object}           解析后的保证金数据, 总数和列表
 */
const parseSecurityWealth = rawData => {
  let securityDeposits = []
  let securityAmount = 0
  let tempValue = 0

  if (rawData.finance_wealth && rawData.finance_wealth.margin_asset_cycle) {
    for (var i in rawData.finance_wealth.margin_asset_cycle) {
      var product = rawData.finance_wealth.margin_asset_cycle[i]
      var productDetail = {}

      productDetail.status = product.status //  状态
      productDetail.accountType = product.margin_acct_type //  100001-联通0元购机活动
      productDetail.usageDesc = product.margin_acct_desc //  活动描述
      productDetail.depositTermDesc = product.deposit_term // 存期描述

      if (product.effective_rate) {
        productDetail.interestRate = product.effective_rate //  利率
      }

      productDetail.isCurrent = false // 是否是活期保证金

      // status
      // 040001-联通0元购机活动存款成功-冻结确认中
      // 100001-联通0元购机活动已起息-冻结中
      // 110002-联通0元购机活动撤单资金解冻失败-解冻确认中
      // 120002-联通0元购机活动违约资金解冻失败-解冻确认中
      // 130002-联通0元购机活动到期资金解冻失败-解冻确认中
      if (product.status && product.status === '100001') {
        productDetail.isFrozen = true // 冻结中,而不是确认中
      }

      if (product.status === '040001') {
        productDetail.statusDesc = '等待起息'
        if (productDetail.accountType === '100001') {
          productDetail.preGenInterestDesc = '联通套餐生效后定存起息'
        }
      } else if (product.status === '100001') {
        productDetail.statusDesc = '定存中'
      } else {
        productDetail.statusDesc = '返还确认中'
      }

      productDetail.amount = parseFloat(product.txn_amount).toFixed(2)
      tempValue += parseFloat(productDetail.amount) // 总资产

      if (product.excepted_interest_amount) {
        productDetail.exceptedInterestAmount = parseFloat(product.excepted_interest_amount).toFixed(2) // 预期收益
      }
      securityDeposits.push(productDetail)
    }
  }

  //  保证金
  if (!isNaN(tempValue)) {
    securityAmount = parseFloat(tempValue).toFixed(2)
  }

  return {securityDeposits, securityAmount}
}

/**
 * 解析黄金资产
 * @param {object} rawWealth - 后台返回的原始资产数据
 * @returns {object} 黄金资产
 */
function parseGoldWealth (rawWealth) {
  const goldWealth = {
    totalAmount: 0,
    totalWeight: 0,
    accumulatedIncomeWeight: 0,
    yesterdayIncomeWeight: 0,
    hasAccount: false,
    // 活期金资产
    currentGold: null,
    // 定期金资产列表
    fixedGolds: []
  }

  // rawWealth.finance_wealth.assets_excep_flag === 1<<6 的时候黄金资产有问题
  const exceptionFlag = 1 << 6

  if (!rawWealth ||
    !rawWealth.finance_wealth ||
    !rawWealth.finance_wealth.assets_excep_flag === exceptionFlag ||
    !Array.isArray(rawWealth.finance_wealth.pmes_cycle)) {
    return goldWealth
  }

  rawWealth.finance_wealth.pmes_cycle.forEach(prod => {
    goldWealth.totalWeight += prod.total_vol
    goldWealth.accumulatedIncomeWeight += prod.total_income
    goldWealth.yesterdayIncomeWeight += prod.last_income
    if (prod.last_close_price) {
      goldWealth.totalAmount += parseFloat(prod.total_vol) * prod.last_close_price
    }

    if (prod.prod_type === 'C') {  // 活期金
      goldWealth.currentGold = {
        ...prod,
        available_vol: Filters.floor(prod.available_vol, 4), // 向上取整避免黄金卖出时大于持有值卖不出去
        total_vol: Filters.floor(prod.total_vol, 4)
      }
      // prod.product_type = FinancialProdType.GOLD_CURRENT
    } else if (prod.prod_type === 'T') { // 定期金
      goldWealth.fixedGolds.push(prod)
      // prod.product_type = FinancialProdType.GOLD_FIXED_TIME
    } else {
      // do nothing
    }
  })
  // 向上取整避免黄金卖出时大于持有值卖不出去
  goldWealth.totalWeight = Filters.floor(goldWealth.totalWeight, 4)

  if (goldWealth.currentGold) {
    goldWealth.hasAccount = !goldWealth.currentGold.noAccount
  } else {
    goldWealth.hasAccount = false
  }

  return goldWealth
}
