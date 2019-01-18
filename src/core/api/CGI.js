/**
 * 定义所有后台接口, 结构如下
 * {
 *   path: '' // 请求路径,
 *   cgiPrefix: '', // 后台系统，例如行内系统，OP系统，CDN等
 *   desc: '' // 接口功能描述, 后续用于数据分析,
 *   request: {}, // 请求数据结构
 *   response: {}, // 响应的数据结构（对应网络接口返回数据中的 ret_data 字段）
 * }
 */
import ServerPrefixType from './ServerPrefixType'
import { Types } from '@unpourtous/mocker'
import { PayType, RedeemType } from '../constants'

const METHOD = Object.freeze({
  GET: 'GET',
  POST: 'POST'
})

const cgiConfig = {
  userWealthV3: {
    // mockable: true,
    path: 'query/wealth/all/v3',
    desc: '资产接口',
    request: {},
    response: {'amount_distribution': {'balance_amount': 97321.81, 'deposit_amount': 70000, 'fund_amount': 2211, 'gold_amount': 45258.06, 'gold_weight': 165.35645807, 'insurance_amount': 0, 'long_finance_amount': 5502, 'margin_amount': 0, 'short_finance_amount': 2100, 'structure_amount': 6900, 'total_amount': 501286337.25, 'webank_amount': 501057044.38, 'wecard_amount': 0}, 'core_account': {'amount': 501078146.38, 'available_amount': 501057044.38, 'behalf_flag': '0', 'effective_rate': 0.35, 'freezing_list': [{'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161108'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161108'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161109'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161113'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161115'}, {'amout': 2000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161118'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161119'}, {'amout': 200, 'flag': '0', 'freezing_code': '22', 'satrt_date': '20161122'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'satrt_date': '20161122'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'satrt_date': '20161122'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'satrt_date': '20161122'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161122'}, {'amout': 1000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161123'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161123'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161123'}, {'amout': 5000, 'flag': '0', 'freezing_code': '22', 'reason': '理财购买', 'satrt_date': '20161202'}, {'amout': 2, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161202'}, {'amout': 5000, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161203'}, {'amout': 200, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20161208'}, {'amout': 500, 'flag': '0', 'freezing_code': '22', 'reason': '理财购买', 'satrt_date': '20170225'}, {'amout': 100, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20170401'}, {'amout': 500, 'flag': '0', 'freezing_code': '22', 'reason': '基金购买', 'satrt_date': '20170401'}], 'last_interest_paid_date': '20170621', 'next_interest_paid_date': '20170921', 'opendate': '20161108'}, 'finance_wealth': {'balance_cycle': [{'available_vol': 97321.81, 'day_buy_amount': 1921, 'day_buy_num': 13, 'day_max_buy_amount': 0, 'day_max_buy_num': 111, 'day_max_redeem_amount': 3000000, 'day_max_redeem_num': 111, 'day_redeem_amount': 1, 'day_redeem_num': 1, 'last_income': 2.01, 'prod_code': '001234', 'prod_name': '国金基金众盈货币', 'total_income': 2.01, 'total_vol': 97445.81}], 'bank_cycle': [{'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 5500, 'can_buy': '1', 'can_modify_dividend': '0', 'can_redeem': '0', 'end_market_date': '20170630', 'prod_code': 'TEMP01', 'prod_name': '哈哈哈', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'rollflag': '3', 'total_income': 0, 'total_vol': 0, 'trans_frozen_vol': 0}], 'fund_cycle': [{'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 1111, 'can_buy': '0', 'can_modify_dividend': '0', 'can_redeem': '1', 'convert_status': '0', 'dividend_method': '1', 'end_market_date': '', 'fee_method': '0', 'first_buy_date': '20161209', 'first_buy_time': '152011', 'income_rate': 0, 'last_buy_date': '20170124', 'last_buy_time': '114123', 'net_value': 1.15, 'net_value_date': '20160817', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': '090001', 'prod_name': '大成价值', 'prod_type': '1', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '', 'ta_account': '000009288033', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 0, 'total_net_value': 1.57, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '1'}, {'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 1100, 'can_buy': '1', 'can_modify_dividend': '0', 'can_redeem': '0', 'convert_status': '0', 'dividend_method': '1', 'end_market_date': '', 'fee_method': '1', 'first_buy_date': '20161220', 'first_buy_time': '194720', 'income_rate': 0, 'last_buy_date': '20161228', 'last_buy_time': '094051', 'net_value': 1.1, 'net_value_date': '20160303', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': '091002', 'prod_name': '大成债券正常更新', 'prod_type': '1', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '', 'ta_account': '000009288033', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 0, 'total_net_value': 1.1, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '1'}, {'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 2, 'can_buy': '0', 'can_modify_dividend': '0', 'can_redeem': '1', 'convert_status': '0', 'dividend_method': '1', 'end_market_date': '20170430', 'fee_method': '0', 'first_buy_date': '20170119', 'first_buy_time': '171136', 'income_rate': 0, 'last_buy_date': '20170119', 'last_buy_time': '171136', 'net_value': 1, 'net_value_date': '20170329', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': 'QQ1206', 'prod_name': '齐鲁稳固21', 'prod_type': '3', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '1', 'ta_account': 'T_0126295001', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 0, 'total_net_value': 0, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '0'}, {'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 100, 'can_buy': '0', 'can_modify_dividend': '0', 'can_redeem': '1', 'convert_status': '3', 'dividend_method': '0', 'end_market_date': '20170215', 'fee_method': '0', 'first_buy_date': '20161228', 'first_buy_time': '094253', 'income_rate': 0.025, 'last_buy_date': '20161228', 'last_buy_time': '094253', 'net_value': 1, 'net_value_date': '20160713', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': 'BC0013', 'prod_name': '方正看跌产品', 'prod_type': '3', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '3', 'ta_account': '0000BC290005', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 0, 'total_net_value': 1, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '1'}, {'available_vol': 0, 'avg_cost': 50000, 'buy_in_trans': 5000, 'can_buy': '0', 'can_modify_dividend': '1', 'can_redeem': '1', 'convert_status': '3', 'dividend_method': '1', 'end_market_date': '20170205', 'fee_method': '0', 'first_buy_date': '20170120', 'first_buy_time': '151653', 'income_rate': 0, 'last_buy_date': '20170120', 'last_buy_time': '151653', 'net_value': 1, 'net_value_date': '20161219', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': 'BC1121', 'prod_name': '方正看跌产品一', 'prod_type': '3', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '3', 'ta_account': '0000BC290005', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 150, 'total_net_value': 0, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '3'}, {'available_vol': 0, 'avg_cost': 0, 'buy_in_trans': 1800, 'can_buy': '0', 'can_modify_dividend': '0', 'can_redeem': '1', 'convert_status': '3', 'dividend_method': '0', 'end_market_date': '20170127', 'fee_method': '0', 'first_buy_date': '20161209', 'first_buy_time': '163006', 'income_rate': 0.025, 'last_buy_date': '20170317', 'last_buy_time': '165746', 'net_value': 1, 'net_value_date': '20160713', 'pledge_availablevol': 0, 'pledge_vol': 0, 'prod_code': 'BCC009', 'prod_name': '方正浮动收益', 'prod_type': '3', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '3', 'ta_account': '0000BC290005', 'ta_frozen_vol': 0, 'total_amount': 0, 'total_income': 0, 'total_net_value': 1, 'total_vol': 0, 'trans_frozen_vol': 0, 'transfer_status': '1'}], 'margin_asset_cycle': [], 'pmes_cycle': [{'available_vol': 143.35645807, 'avg_cost': 266.97, 'interest_rate': 0.015, 'last_close_price': 273.7, 'last_income': 0.00163971, 'last_income_date': '20161231', 'pm_acct_no': 'CK001000100201612150000000002', 'prod_code': '10001', 'prod_name': '微众金活期', 'prod_type': 'C', 'total_income': 0.03776159, 'total_vol': 165.35645807}], 'ptx_cycle': [{'available_vol': 1100, 'buy_in_trans': 1100, 'confirmed_no_income_cycle': [], 'income_view_flag': '0', 'last_income': 0, 'last_income_date': '0', 'net_value': 1, 'net_value_date': '20161206', 'prod_code': 'ZA20161206', 'prod_name': '众赢二号', 'prod_status': '1', 'prod_type': 'ZAX', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'refund_income': 0, 'rollflag': '3', 'ta_account': 'ZA', 'ta_no': 'ZA', 'total_amount': 1100, 'total_income': 0, 'total_vol': 1100}, {'available_vol': 1000, 'buy_in_trans': 0, 'income_view_flag': '0', 'last_income': 0, 'last_income_date': '0', 'net_value': 1, 'net_value_date': '20170302', 'prod_code': 'ATltx', 'prod_name': '投连险自动化', 'prod_status': '1', 'prod_type': 'TLX', 'redeem_in_trans_confirmed': 0, 'redeem_in_trans_confirming': 0, 'refund_amount': 0, 'rollflag': '3', 'total_amount': 1000, 'total_income': 0, 'total_vol': 1000}], 'quote_repo_cycle': [], 'system_time': '20170329204020', 'webank_card_cycle': [{'account_balance': 10000, 'account_status': 'A', 'available_balance': 10000, 'currency_code': '01', 'deposit_term': '3M', 'deposit_type': '01', 'draw_amount_per_term': 0, 'effective_rate': 1.32, 'effective_rate_str': '1.32', 'expiry_date': '20170208', 'fixed_current_flag': '1', 'interest_paid': 0, 'prod_code': '11200401-1', 'product_id': '11200401', 'refund_type': '03', 'reinverst_term': '3M', 'reinvest_mode': '1', 'subaccount_serial_no': '00002', 'to_draw_times': 0, 'value_date': '20161108'}, {'account_balance': 10000, 'account_status': 'A', 'available_balance': 10000, 'currency_code': '01', 'deposit_term': '3M', 'deposit_type': '01', 'draw_amount_per_term': 0, 'effective_rate': 1.32, 'effective_rate_str': '1.32', 'expiry_date': '20170208', 'fixed_current_flag': '1', 'interest_paid': 0, 'prod_code': '11200401-1', 'product_id': '11200401', 'refund_type': '02', 'reinvest_mode': '0', 'subaccount_serial_no': '00003', 'to_draw_times': 0, 'value_date': '20161108'}, {'account_balance': 0, 'account_status': 'C', 'available_balance': 0, 'currency_code': '01', 'deposit_term': '3M', 'deposit_type': '01', 'draw_amount_per_term': 0, 'effective_rate': 1.32, 'effective_rate_str': '1.32', 'expiry_date': '20170213', 'fixed_current_flag': '1', 'interest_paid': 0, 'prod_code': '11200401-1', 'product_id': '11200401', 'refund_type': '03', 'reinverst_term': '3M', 'reinvest_mode': '1', 'subaccount_serial_no': '00004', 'to_draw_times': 0, 'value_date': '20161113'}, {'account_balance': 0, 'account_status': 'C', 'available_balance': 0, 'currency_code': '01', 'deposit_term': '1Y', 'deposit_type': '01', 'draw_amount_per_term': 0, 'effective_rate': 1.8, 'effective_rate_str': '1.80', 'expiry_date': '20171118', 'fixed_current_flag': '1', 'interest_paid': 0, 'prod_code': '11200401-1', 'product_id': '11200401', 'refund_type': '03', 'reinverst_term': '1Y', 'reinvest_mode': '1', 'subaccount_serial_no': '00005', 'to_draw_times': 0, 'value_date': '20161118'}, {'account_balance': 50000, 'account_status': 'A', 'available_balance': 50000, 'currency_code': '01', 'deposit_term': '5Y', 'deposit_type': '03', 'draw_amount_per_term': 0, 'effective_rate': 5.05, 'effective_rate_str': '5.05', 'expiry_date': '20220815', 'fixed_current_flag': '1', 'interest_paid': 0, 'last_interest_paid_date': '20170815', 'next_interest_paid_date': '20170915', 'prod_code': '11201401-1', 'product_id': '11201401', 'refund_type': '11', 'reinvest_mode': '0', 'subaccount_serial_no': '00006', 'to_draw_times': 0, 'value_date': '20170815'}], 'wnx_cycle': []}}
  },
  userWealthV2: {
    path: 'query/wealth/all/v2',
    desc: '资产接口V2'
  },
  requestConfirmingList: {
    method: METHOD.GET,
    path: 'query/wealth/unconfirm',
    desc: '查询在途资产',
    request: {},
    response: {
      has_next: false,
      next_index: 0,
      product_list: [{
        acct_no: '', // 微众卡号,
        applicationamount: 100.0,
        applicationvol: 0.0,
        bank_name: '微众银行',
        busi_code: '022',
        card_type: '储蓄卡',
        card_typeid: '10',
        comfirm_date: '',
        confirmedamount: 0.0,
        confirmedvol: 0.0,
        nav: 3.013000,
        pay_flag: '2',
        pay_money: 0.0,
        pay_prod_id: '001234',
        plan_no: '',
        prod_code: '000577',
        prod_name: '安信价值精选',
        refund_actual_amount: 0.0,
        refund_application_amount: 0.0,
        rtn_desc: '申请成功',
        self_tranc_desc: '活期+ 购买 股基',
        total_cash: 0.0,
        trans_amt: 100.0,
        trans_date: '20180112',
        trans_fees: 0.0,
        trans_serno: '18011201102027pr0rbfG8nMPxLEtoNo',
        trans_status: '1',
        trans_time: '145548',
        trans_type: '60',
        weunion_paid_by_webankcard: 0.0,
        wms_product_type: '1'
      }]
    }
  },
  requestProductCanCancelList: {
    method: METHOD.GET,
    path: 'query/prod/cancellist',
    desc: '查询可取消交易列表',
    request: {
      prod_code: ''
    },
    response: {
      list: [
        {
          businesscode: '022',
          cust_name: 'xx',
          ori_biz_seq_id: '18011201102027R8uIWnu3gGZ41q4noU',
          prod_code: '000577',
          prod_name: '安信价值精选',
          taname: '安信',
          tano: '75',
          trans_amt: 10.0,
          trans_date: '20180115',
          trans_time: '093100',
          trans_vol: 0.0
        }
      ],
      total_count: 0
    }
  },
  // 批量接口
  requestProductCanCancelListBatch: {
    method: METHOD.GET,
    path: 'query/prod/cancellistbatch',
    desc: '查询可取消交易列表批量',
    request: {
      prod_code_list: []
    },
    response: {
      list: [
        {
          businesscode: '022',
          cust_name: 'xx',
          ori_biz_seq_id: '18011201102027R8uIWnu3gGZ41q4noU',
          prod_code: '000577',
          prod_name: '安信价值精选',
          taname: '安信',
          tano: '75',
          trans_amt: 10.0,
          trans_date: '20180115',
          trans_time: '093100',
          trans_vol: 0.0
        }
      ],
      total_count: 0
    }
  },
  // 投资模块
  requestInvestmentListUnlogin: {
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    path: 'productinfo/getinvestpageviewinfoV3',
    desc: '投资列表数据 投资页卡 V3(无登录态)',
    request: {
      sign: ''
      // permissionContext: ''
    },
    response: {
      productTypeList: [
        // too much data
      ]
    }
  },
  requestInvestmentListLogin: {
    method: METHOD.GET,
    path: 'productinfo/getinvestpageviewinfoV3',
    desc: '投资列表数据 投资页卡 V3(有登录态)',
    request: {
      sign: '',
      permissionContext: ''
    },
    response: {}
  },
  requestFinancePeriodInfo: {
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    path: 'productinfo/financeperiodinfo',
    desc: '获取理财周期列表',
    request: {
      productList: [{
        prod_code: '',
        buy_time_list: [] // uct8格式的YYYYMMDDHHmmss
      }]
    },
    response: {
      productList: [{
        buy_time: '',
        real_buy_date: '',
        value_date: '',
        expire_date: '',
        arrival_account_date: '',
        last_expire_date: '',
        last_arrival_account_date: ''
      }]
    }
  },
  updateUserInfo: {
    path: 'risk/assessment/usr_info_upload',
    method: METHOD.POST,
    desc: '更新地址邮箱职业信息',
    request: {
      address: '',
      occupation_type: '',
      email: ''
    }
  },
  extraPersonalInfo: {
    path: 'user/queryextuserinfo/v3',
    desc: '附加个人信息',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  queryBankInfo: {
    path: 'query/bank_info/v2',
    desc: '查询银行卡详情',
    request: {
      account: Types.string(),
      usage: Types.string()
    },
    response: {
      card_typeid: '',
      bank_name: '',
      card_type: '',
      clear_no_pbc: ''
    }
  },
  payeeBankLimit: {
    path: 'query/payment/limit/payee',
    desc: '拉取收款行的邮路限额',
    method: METHOD.GET,
    request: {
      payee_acct: '', // 收款人卡号
      payee_open_bank: '' // 收款人开户行行号
    },
    response: {
      day_limit: '', // 当日限额
      single_limit: '', // 单笔限额
      avaliable_day_limit: '' // 当日可用限额
    }
  },
  requestSendOTP: {
    path: 'user/register_phone_check_num_self',
    desc: '请求OTP，并校验绑定的手机号',
    method: METHOD.POST,
    request: {
      usage_id: '', // GLOBAL_CONSTANT.OPT_TYPE.MODIFY_PASS|BIND_CARD|...
      ecif_no: '',
      otp_params_session: ''
    },
    response: {
      session_id: ''
    }
  },

  requestOTPByPhone: {
    path: 'user/register_phone_check_num',
    desc: '请求制定手机号的OTP',
    request: {
      usage_id: '', // GLOBAL_CONSTANT.OPT_TYPE.MODIFY_PASS|BIND_CARD|...
      phone_no: ''
    },
    response: {}
  },

  bindCardV2: {
    path: 'finance/account/bind_card/v3',
    desc: '绑卡（支持信用卡）',
    method: METHOD.POST,
    request: {
      other_card_no: '',
      face_id: '',
      artificial_faceck_id: '',
      extra_info: '',
      contract_ver_wt: '',
      session_id: '',
      force_reg: '',    // 三要素不通过也强制登记: '',
      // 如果传了电话号,则优先使用传的: '',
      other_phone_no: '',
      change_phone: '',
      otp_session_id: '',
      faceck_flag: '', // 错挑对标记, F3Y1表示三次失败一次黄灯: '',
      bank_card_mnt_code: ''  // 1绑卡 2登记绑卡: '',
    },
    response: {}
  },

  bindCardWidthoutFaceIdClass1: {
    path: 'finance/account/rich/bind_card',
    desc: '一类户不刷脸绑卡接口',
    method: METHOD.POST,
    request: {
      other_card_no: '',
      other_phone_no: '',
      other_phone_check_num: '',
      face_id: '',
      artificial_faceck_id: '',
      extra_info: 'REG',
      contract_ver_wt: '',
      session_id: '',
      force_reg: '',
      bank_card_mnt_code: 1
    },
    response: {

    }
  },

  unbindCardV2: {
    path: 'finance/account/unbind_card/v2',
    desc: '解绑银行卡V2'
  },
  queryPaymentLimit: {
    path: 'query/payment/limit',
    desc: '查询银行卡每日限(转出)',
    method: 'GET',
    // cacheMaxAgeInMs: 0,
    request: {
      payer_acct: 'string'
    },
    response: {
      ret_data: {
        day_limit: '', single_limit: '', avaliable_day_limit: ''
      }
    }
  },
  queryPaymentLimitBatch: {
    path: 'query/payment/limit/batch',
    desc: '批量查询银行卡每日限(转出)',
    method: 'GET',
    cacheMaxAgeInMs: 0,
    request: {
      payer_acct_list: ['cardNo1', 'cardNo2'],
      query_type: '3' // 1-只查限额 2-只查签约 3-查限额和签约, 不填默认1
    },
    response: {
      ret_data: [{card_no: '', day_limit: '', single_limit: '', avaliable_day_limit: '', pay_route_code: '', need_sign: '', sign_pay_route_code: ''}]
    }
  },
  requestCardDetail: {
    path: 'user/copy/card_info',
    desc: '请求银行卡详情',
    method: METHOD.POST,
    request: {
      types: ['personal_name', 'card_no', 'card_name'],
      card_no: '',
      password: 'passwordRSA'
    }
  },

  getFriendList: {
    path: 'sns/getfriendlist',
    desc: '获取好友列表, 获取平台好友列表',
    cgiPrefix: ServerPrefixType.OP,
    cacheMaxAgeInMs: Number.MAX_SAFE_INTEGER,
    request: {
      isNeedBigHead: 'boolean', // 标识是否高清头像
      scene: 'high_net_value' // 标识好友的使用场景
    },
    response: {
      friends: [{
        ecif: '',
        fUserInfo: {
          head: 'http://wx.qlogo.cn/mmhead/PiajxSqBRaELNLmuBHl1Ag******/46',
          nick: 'Xiang***',
          userId: 'ozf_BuA2Aaz****',
          userType: 'weixin'
        }
      }]
    }
  },
  notifyUpdateUserdata: {
    path: 'base/notifyupdateuserdata',
    desc: '通知后台刷新用户数据',
    cgiPrefix: ServerPrefixType.OP
  },
  queryOrderCardsHistory: {
    path: 'finance/query/ordercardshistory',
    desc: '好友转账:历史收款人列表'
  },

  querySavedCards: {
    path: 'user/query_saved_cards',
    desc: '非同名转账:历史收款人列表'
  },

  querySavedCardsIncludeFriend: {
    path: 'user/query_saved_cards/comm_friend',

    desc: '非同名转账:历史收款人列表V2(增加好友转账)',
    response: {
      hj_biz_no: '17031401002027GphsEupPamaw681ltO',
      process_type: 'sync',
      ret_code: '20270000',
      ret_data: [
        {
          can_be_charged: '1',
          other_account: '6236330014121*****',
          other_bank_bin_code: '323584000888',
          other_bank_name: '微众银行',
          other_card_type: '储蓄卡',
          other_card_type_code: '10',
          other_ecif_no: '0999960000******',
          other_name: '张建强',
          other_phone_no: '1316992****',
          scene: 'friendtranser',
          we_union_status: ''
        }
      ]
    }
  },
  transferToFriendWebank: {
    path: 'finance/friend_turn_out/v3',
    desc: '单笔转出from微众卡to微信/QQ号(token校验)',
    method: METHOD.POST,
    request: {
      // ecif: payee.ecif,
      // userId: payee.openId,
      // userType: 'weixin',
      // trans_amount: amount,
      // session_id: passwordSessionId,
      // remark_v2: remark,
      // otp_session_id: '',
      // ignore_risk: '',
      // ignore_session: '',
      // name: payee.name,
      // we_card_no: null,
      // pay_application: GC.PAY_APPLICATION_CODE.WEBANK_UNION,
      // need_wcas_check: '',
      // sign_biz_seq: '',
      // sign_text: ''
    },
    response: {}
  },

  /**
   * 查询所有支持的银行卡
   */
  queryAllBankList: {
    path: 'appconf/common/bank_info.json',
    cgiPrefix: ServerPrefixType.CDN,
    cacheMaxAgeInMs: Number.MAX_SAFE_INTEGER
  },

  queryWebankCard: {
    path: 'user/querywebankcard',
    desc: '查询好友的微众卡后四位()'
  },

  addCloseFriend: {
    path: 'rich/friend/add_close_friend',
    desc: '添加密友'
  },
  queryAllFriendExtInfo: {
    path: 'rich/friend/query_all_friends',
    desc: '查询所有好友信息',
    response: [
      {
        ecif_no: '0999960000008287',
        name: '',
        phone_no: '',
        remark: ''
      }
    ]
  },
  queryAllCardGroup: {
    path: 'rich/transfer/query_all_cards',
    desc: '查询所有卡片组',
    cacheMaxAgeInMs: 0,
    response: [{
      group_name: '',
      bank_items: [
        {
          can_be_charged: '1',
          other_account: '6236330070000088920',
          other_bank_bin_code: '323584000888',
          other_bank_name: '微众银行',
          other_card_type: '储蓄卡',
          other_card_type_code: '10',
          other_ecif_no: '0999960000009042',
          other_name: '胡巧珍',
          other_phone_no: '15019482577',
          scene: 'friendtranser'
        }
      ],
      other_account: '',
      other_name: '',
      other_bank_name: '',
      other_phone_no: '',
      other_ecif_no: ''
    }]
  },
  addGroup: {
    path: 'rich/transfer/add_group',
    desc: '添加分组(合并联系人)',
    method: METHOD.POST,
    request: {
      group_name: '',
      items: {
        banks: [
          {
            card_no: '',
            card_no_sct: '',
            bank_name: ''
          }
        ]
      }
    },
    response: {}
  },
  updateFriendInfo: {
    path: 'rich/friend/set_friend_info',
    desc: '更新密友信息',
    request: {
      open_id: '',
      ecif_no: '',
      remark: '',
      status: ''
    }
  },
  queryTransferNum: {
    path: 'rich/transfer/query_transfer_num',
    desc: '查询转账次数',
    request: {
      opposite_acct_no: '' // 为空则查询全部
    },
    cacheMaxAgeInMs: 0, // 此接口不缓存
    response: {
      webank_card_no: '', // 己方微众卡号
      opposite_info_list: [ // 对方信息列表
        {
          in_times: 0,
          opposite_acct_no: '6236330070000019578',
          opposite_name: '拖小宝',
          out_times: 1
        }
      ]
    }
  },
  queryTransferDetail: {
    path: 'rich/transfer/query_transfer_detail',
    desc: '查询转账次数（批量卡返回一个list按时间排序）',
    request: {
      opposite_acct_no: '' // 为空则查询全部
    },
    cacheMaxAgeInMs: 0, // 此接口不缓存
    response: {
      webank_card_no: '', // 己方微众卡号
      opposite_info_list: [ // 对方信息列表
        {
          in_times: 0,
          opposite_acct_no: '6236330070000019578',
          opposite_name: '拖小宝',
          out_times: 1
        }
      ]
    }
  },
  queryTransferNumBatch: {
    path: 'rich/transfer/query_transfer_num/batch',
    desc: '批量查询转账次数',
    request: {
      opposite_acct_no: ['cardNo1', 'cardNo2'] // 为空则查询全部
    },
    cacheMaxAgeInMs: 0, // 此接口不缓存
    response: {
      webank_card_no: '', // 己方微众卡号
      opposite_info_list: [ // 对方信息列表
        {
          in_times: 0,
          opposite_acct_no: '6236330070000019578',
          opposite_name: '拖小宝',
          out_times: 1
        }
      ]
    }
  },
  requestPurchaseMonetaryFund: {
    path: 'finance/buy_v2',
    desc: '转入活期+',
    request: {
      bank_code: '',
      card_no: '',
      use_webank_card: false,
      transaction_amount: '',
      product_code: '001234',
      user_pwd: 'RSA****',
      remark: '购买货基'
    },
    response: {}
  },
  /**
   * 赎回HJ，也就是转出
   */
  requestRedeemMonetaryFund: {
    path: 'finance/sale_v2',
    desc: '赎回活期+',
    request: {
      use_webank_card: true,
      user_pwd: '',
      transaction_amount: '',
      product_code: '001234',
      remark: '赎回货基',
      need_wcas_check: '',
      sign_biz_seq: '',
      sign_text: ''
    },
    response: {}
  },

  requestRedeemMonetaryFundToFriend: {
    method: METHOD.POST,
    path: 'fund/redeemtofriend',
    desc: '赎回活期+并转账给好友',
    request: {
      name: '',
      ecif: '',
      userId: '',
      userType: '',
      session_id: '',
      transaction_amount: '',
      product_code: '001234',
      remark_v2: '赎回货基',
      otp_session_id: '',
      need_wcas_check: '',
      sign_biz_seq: '',
      sign_text: '',
      ignore_risk: '',
      ignore_session: '',
      face_id: '',
      redeem_type: '',
      ignore_mtfund_redeemtype: true
    },
    response: {}
  },

  requestTransNotiBillInfo: {
    path: 'finance/query/transtobillcode',
    desc: '请求转账凭证数据(告诉好友)',
    request: {
      tans_amt: Types.number(),
      payee_name: Types.string(),
      tans_datetime: '',
      remark: '',
      deal_type: Types.number(),
      payee_acct: '',
      payee_ecif_no: '',
      payer_acct_type: ''
    },
    response: {
      billcode: Types.string(),
      payee_name: Types.string()
    }
  },

  /**
   * 查询处理中的订单状态
   *
   * 类型参数:
   * 0-申购，1-赎回，2-转入，3-转出,4-撤销
   *
   * 返回值:
   * 0-未知(刚进入交易的初始状态）1-申请成功2-申请失败
   * 3-确认成功 4-确认失败 5-已撤单 6-超时
   */
  queryOrderStatus: {
    path: 'finance/query/order_status',
    desc: '查询处理中的订单状态',
    cacheMaxAgeInMs: 0,
    request: {
      query_type: '',
      trans_serno: '',
      prod_code: ''
    },
    response: {}
  },

  requestFriendCloseFriendList: {
    path: 'rich/friend/query_all_close_friends',
    desc: '拉取密友列表',
    request: {},
    response: {
      ecif_no: '',
      name: '',
      phone_no: '',
      remark: '',
      banks: [],
      card_no: '',
      bank_name: ''
    }
  },
  // DEV_DEMO 后台接口定义,
  // desc: 建议填写用于后续问题跟踪和数据分析用,
  // request&response: 将开发过程中的请求和返回脱敏过以后填到这里暂时解决前后台文档不足的问题
  verifyPassword: {
    path: 'user/password/verify',
    desc: '验证密码',
    method: METHOD.POST,
    request: {
      user_pwd: '',
      user_old_pwd: '', // 和user_pwd用同一个字段
      ecif_no: '' // 可选参数
    },
    response: {
      session_expire_time: 600,
      session_id: '14BB8CAC5******'
    }
    //   var obj = {};
    // transSession = '';
  },

  passwordRandomNum: {
    path: 'user/get_random_num',
    desc: '拉取验证密码防重因子',
    request: {},
    response: {},
    method: METHOD.GET,
    cacheMaxAgeInMs: 0
  },

// (obj).then(onVerifyPasswordOK, onVerifyPasswordError);
  // OTP验证
  otpVerify: {
    path: 'user/veriry_phone_check_num_self',
    desc: 'OTP验证',
    method: METHOD.POST,
    request: {
      phone_check_num: '' // otp
    },
    response: {
      session_id: ''
    }
  },

  userSettingSave: {
    path: 'user/setting/save',
    request: {
      type: [
        'bankcard_remark' // 卡备注
      ]
    },
    desc: '查询用户设置'
  },

  /**
   * 用户设置批量查询
   */
  userSettingBatchQuery: {
    path: 'user/setting/query/batch',
    method: METHOD.GET,
    desc: '查询用户设置',
    request: {},
    response: {}
  },
  /**
   * 用户设置查询
   */
  userSettingQuery: {
    method: METHOD.GET,
    path: 'user/setting/query',
    desc: '查询用户设置',
    request: {
      type: Types.string() // 类型
    },
    response: {
      ret_code: '20270000',
      ret_msg: 'succ',
      ret_data: {
        day_limit_banbance: 50000,
        day_limit_maxs_amount: 50000,
        type: 'LIMIT00009'
      }
    }
  },
  /**
   * 设置用户设置
   */
  userSettingSet: {
    method: METHOD.POST,
    path: '/user/setting/set',
    desc: '非同名转账-用户属性设置',
    request: {
      type: Types.string(), // 类型, 参考ACCOUNT_LIMIT.LIMIT_DEF的值
      value: Types.string(),
      trans_pwd: Types.string(), // 密码校验的session
      face_id: Types.string(), // 刷脸ID，有就传
      secck_session_id: Types.string(),
      session_id: Types.string(),
      // 是否使用密码验证通过后的session, 调高转账限额时，这个接口以前时在后台验密的，需要改成前台验密，带session，'1'-带验密后的session
      use_pwd_session: ''
    },
    response: {
      ret_code: '20270000',
      ret_msg: 'succ',
      ret_data: {
        type: Types.string(),
        value: Types.number()
      }
    }
  },
  // 交易记录 ============================================
  requestTransRecordList: {
    path: 'finance/query/translist/v1',
    method: METHOD.GET,
    desc: '请求交易列表',
    request: {
      query_num: '', // -1代表由后台定义
      start_row: '',
      start_date: '',
      end_date: '',
      query_type: '',
      inquery_order: ''
    },
    response: [{
      payee_name: '他行卡',
      payee_no: '10100201303007020000011',
      payer_nam: '微众卡',
      prod_code: '000312',
      trans_amt: '16.80元',
      trans_desc: '财付通快捷支付',
      trans_flag: '0',
      trans_serno: '17042311E03181931880306306890682',
      trans_status: '',
      trans_time: '2017-04-23 15:18',
      trans_type: '71',
      trans_type_desc: '财付通快捷支付'
    }]
  },
  /**
   * 查询产品的交易记录
   */
  requestProdTransHistory: {
    path: 'finance/query/translist/v1',
    method: METHOD.GET,
    desc: '请求交易列表',
    request: {
      query_num: 20, // 每页20条
      prod_code: '000577',
      start_row: 0,
      start_date: '20150815',
      end_date: '20170707'
    },
    response: [{
      payee_name: '他行卡',
      payee_no: '10100201303007020000011',
      payer_nam: '微众卡',
      prod_code: '000312',
      trans_amt: '16.80元',
      trans_desc: '财付通快捷支付',
      trans_flag: '0',
      trans_serno: '17042311E03181931880306306890682',
      trans_status: '',
      trans_time: '2017-04-23 15:18',
      trans_type: '71',
      trans_type_desc: '财付通快捷支付'
    }]
  },
  requestTransRecordDetail: {
    path: 'finance/query/translist/detail',
    desc: '获取交易详情',
    method: METHOD.GET,

    request: {
      biz_seq: '',
      prod_code: '',
      trans_type: '',
      trans_status: '',
      trans_flag: ''
    },
    response: {}
  },
  requestTransRecordDetailV2: {
    path: 'finance/query/translist/detail/v2',
    desc: '获取交易详情v2版',
    method: METHOD.GET,

    request: {
      biz_seq: ''
    },
    response: {}
  },
  requestTransExtDetail: {
    path: 'finance/query/orderextinfo',
    desc: '获取交易详情',
    method: METHOD.GET,
    request: {
      bizNo: ''
    },
    response: {

    }
  },

  /**
   * 货基、建信养老保障历史收益：7日年化、万份收益
   */
  requestProductHistoryIncomeRate: {
    path: 'history/query/rates',
    desc: '货基、建信养老保障历史收益',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    request: {
      prod_code: '', // -1代表由后台定义
      start_date: '',
      end_date: ''
    },
    response: {
      '20180419': {
        earnings_rate_date: '20180419',
        income_rate: 3.99, // 最近七日年化
        million_of_income: 0.75, // 万分收益
        prod_code: '001234',
        prod_type: '2'
      }
    }
  },

  /**
   * 设置用户自定义任务
   * type: WB2MF 微众卡到活期+
   * status: Y-有效、N-失效
   *
   * return
   * is_settrue为成功、false为失败
   */
  setUserTask: {
    path: 'user_task/set',
    desc: '设置用户自定义任务',
    request: {
      type: '', // WB2MF 微众卡到活期+
      status: ''
    }
  },

  /**
   * 查询用户自定义任务
   * infos  信息列表
   *   type  WB2MF 微众卡到活期+
   *   status  Y-有效、N-失效
   *   type  WB2MF 微众卡到活期+
   *   status  Y-有效、N-失效
   */
  queryUserTask: {
    path: 'user_task/query',
    desc: '查询用户自定义任务',
    cacheMaxAgeInMs: 0,
    request: {}
  },

  /**
   * 微众金订单查询
   */
  queryGoldInfoRequest: {
    path: 'gold/query_order',
    desc: '黄金查询',
    cacheMaxAgeInMs: 0,
    request: {
      transaction_start_date: '',
      transaction_end_date: ''
    }
  },
  requestGoldPrice: {
    path: 'gold/query_current_price',
    desc: '获取黄金实时金价',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    reuseRequestTime: 15000,
    request: {},
    response: {
      askPrice: Types.string(),
      bidPrice: Types.string()
    }
  },
  requestGoldPriceTencent: {
    path: 'gold/current_price',
    desc: '获取黄金实时金价(未登录)',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    method: METHOD.GET,
    request: {},
    response: {
      askPrice: Types.string(),
      bidPrice: Types.string()
    }
  },
  /**
   * 微众金新手标志查询
   */
  queryGoldNewerFlag: {
    path: 'gold/is_new_buyer',
    desc: '黄金新手标志查询',
    method: METHOD.GET,
    // cacheMaxAgeInMs: 0,
    request: {
    },
    response: {
      ret_data: {
        is_new: 0
      }
    }
  },
  requestPendingCurrentGold: {
    method: METHOD.GET,
    path: 'gold/query_order',
    desc: '查询挂单的活期金',
    cacheMaxAgeInMs: 0,
    request: {
      // 格式 YYYYMMDD
      transaction_start_date: Types.string(),
      // 格式 YYYYMMDD
      transaction_end_date: Types.string()
    }
  },
  requestScheduledCurrentGold: {
    method: METHOD.GET,
    path: 'gold/schedule/query',
    desc: '查询微众金定投列表',
    request: null
  },
  /**
   * 获取在途资金明细
   */
  queryInTransWealthInfo: {
    path: 'finance/query/trans_detail/in_transit',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    desc: '获取在途资金明细',
    request: {
      prod_code: '' // 产品代码
    },
    response: {
      cycle: [{
        acct_no: '6236330070000043701',
        bank_name: '微众银行',
        busi_code: '124',
        card_no: '6236330070000043701',
        fnc_trans_acct_no: '20170330O10021001',
        prod_code: '001234',
        prod_name: '国金基金众盈货币',
        redeem_to_account_date: '20170711',
        trans_amount: 6,
        trans_date: '20170710',
        trans_serno: '1709280O102019000000000000379365',
        trans_status: '0',
        trans_time: '113500',
        trans_type: '1'
      }]
    }
  },

  /**
   * 获取RDCN接口白名单
   */
  RDCNWhiteListConfig: {
    path: 'appconf/common/only_olduser_cgis.json',
    cgiPrefix: ServerPrefixType.CDN,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    cacheMaxAgeInMs: Number.MAX_SAFE_INTEGER,
    desc: '获取RDCN接口白名单',
    request: {},
    response: [
      {
        cgi: '/hj/risk/assessment/query'
      },
      {
        cgi: '/hj/risk/assessment/submit'
      }
    ]
  },
  /**
   * 拉取静态配置文件
   */
  commonConfig: {
    path: 'common.json',
    cgiPrefix: ServerPrefixType.DATA_CGI_PREFIX,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    desc: '静态配置',
    request: {},
    response: {
      reapply_max_count: 5,
      fack_ck_expire_minutes: '15',
      qq_guanjia_sdk_open: '1',
      artificial_face_ck_time_start: '08:00',
      artificial_face_ck_time_end: '22:00',
      async_examine_time_start: '09:00',
      async_examine_time_end: '20:00',
      union_pay_open: '1',
      wb_login_security_open: '1',
      wb_login_security_open_ios: '1',
      friends_transfer: '0',
      friends_transfer_v2: '1',
      we_pay_open: '0',
      we_pay_openV2: '1',
      can_use_unknown_bank_card: '1',
      lock_screen_open: '1',
      lock_screen_open_android: '1',
      birth_splash_open: '1',
      webank_card_max_day_limit: '10000000.00', // 微众卡单日限额
      current_plus_max_day_limit: '3000000.00' // 活期+单日限额
    }
  },

  requestPreRequestConfig: {
    mockable: false,
    path: 'app/staticConfig/PreRequest.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    desc: '预请求配置文件',
    request: {},
    response: {
      _comment: '预请求配置文件',
      list: [{
        from: ['tplusn/TplusnDetailScene', 'tplus/TplusnMyDetailScene'],
        to: 'tplusn/TplusnPurchaseScene',
        delay: 3000,
        valid: true,
        needLogin: true
      }]
    }
  },

  schemaMappingConfig: {
    // mockable: true,
    path: 'app/staticConfig/schemaMapping.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    desc: '新老兼容的schema适配配置',
    request: {},
    response: [{
      oldPattern: '/monetaryMyProdDetail/:prodCode',
      newPattern: 'monetaryFund/MonetaryFundDetailScene'
    }, {
      oldPattern: '/financialHomeMore/:type',
      newPattern: 'finance/FinanceHomeMoreScene'
    }, {
      oldPattern: '/home',
      newPattern: 'home/HomeScene',
      params: {
        tabName: 'HomeTab'
      }
    }, {
      oldPattern: '/financialHome',
      newPattern: 'home/HomeScene',
      params: {
        tabName: 'FinancialTab'
      }
    }, {
      oldPattern: '/investmentHome',
      newPattern: 'home/HomeScene',
      params: {
        tabName: 'InvestTab'
      }
    }]
  },
  domainList: {
    mockable: false,
    path: 'app/staticConfig/domain.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    desc: 'WebViewProScene Domain List',
    request: {},
    response: {
      whitelist: '(\\.webank\\.com|\\.webankcdn\\.net|\\.qq\\.com)$'
    }
  },
  forceTouchConfig: {
    mockable: false,
    path: 'app/staticConfig/forceTouch.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    desc: 'IOS Force Touch Menu Config',
    request: {},
    response: {
      enable: true,
      menus: [{
        title: '交易流水',
        type: '/transRecordV2',
        icon: 'pdd'
        // icon: 'force-touch-transin'
      }]
    }
  },
  appConfig: {
    mockable: false,
    path: 'app/staticConfig/app.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    staticFile: true, // 静态配置文件，没有retCode
    desc: 'Static App Config in CDN',
    request: {},
    response: {
      is_close_account_in_app: true
    }
  },
  requestNotifyMap: {
    path: 'app/staticConfig/appSceneNotify.json',
    cgiPrefix: ServerPrefixType.CDN_HJUPLOAD,
    method: METHOD.GET,
    staticFile: true, // 静态配置文件，没有retCode
    cacheMaxAgeInMs: Number.MAX_SAFE_INTEGER,
    desc: '获取页面通知配置文件',
    request: {},
    response: {}
  },
  productInfo: {
    path: 'productinfo/getproductinfo',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    method: METHOD.GET,
    // 这几个数据变动不频繁，可以将 cache 过期时间设置长一点
    cacheMaxAgeInMs: 24 * 60 * 60000,
    desc: '查询节假日表/黄金提金地址表/银行卡限额等',
    request: {
      /**
       * 参考 HJ H5 base-config-service.js
       * [
       *  {name: 'holidays', sign: ''},
       *  {name: 'bank_limit', sign: ''},
       *  {name: 'config_bank_batch', sign: ''},
       *  {name: 'gold_pickup_addr', sign: ''},
       * ]
       */
      productInfoList: Types.Array
    },
    response: {
      nextCheckTimeDiv: 60,
      productInfoList: [
        {
          changed: true,
          content: '[{"start":"20160101","end":"20160103"},{"start":"20160207","end":"20160213"},{"start":"20160402","end":"20160404"},{"start":"20160430","end":"20160502"},{"start":"20160609","end":"20160611"},{"start":"20160915","end":"20160917"},{"start":"20161001","end":"20161007"},{"start":"20150101","end":"20150103"},{"start":"20150218","end":"20150224"},{"start":"20150404","end":"20150406"},{"start":"20150501","end":"20150503"},{"start":"20150620","end":"20150622"},{"start":"20150903","end":"20150906"},{"start":"20150926","end":"20150927"},{"start":"20151001","end":"20151007"},{"start":"20170903","end":"20170903"},{"start":"20170913","end":"20170913"}]',
          name: 'holidays',
          sign: 'b573ac616aa8634bd02d7c1bcc1ef507'
        }
      ] // 配置数组
    }
  },
  // HKE 云证通  === start
  encryptedUserInfo: {
    path: 'user/query_personnal_info/cert',
    desc: '加密的客户信息,提供给云证通SDK使用',
    response: {
      name: '',  // 姓名
      personal_identification_type: '', // 证件类型
      personal_identify_no: '', // 证件号
      phone_no: '' // 电话号码
    }
  },
  hkeServerSign: {
    path: 'finance/coopcert_sign',
    desc: '云证通svr签名',
    responese: {
      sign_result_list: [     // 签名结果数组
        {
          sign_id: '',     // 签名id
          sign_flag: '',   // 签名结果，S:成功 F:失败
          sign_result: ''  // 签名值
        }
      ]
    }
  },
  hkeServerSignAgain: {
    path: 'finance/coopcert_sign/again',
    desc: '云证通svr第二次签名,因为和第一次签名的时间间隔很短,因此另开一个接口,绕开后台的同接口频率限制',
    response: {
      sign_result_list: [     // 签名结果数组
        {
          sign_id: '',     // 签名id
          sign_flag: '',   // 签名结果，S:成功 F:失败
          sign_result: ''  // 签名值
        }
      ]
    }
  },
  hkeCertAsyncCheck: {
    path: 'finance/coopcert_download',
    desc: '云证通证书送异步审核',
    response: {
    }
  },
  // HKE 云证通  === end

  // 微众卡挂失
  reportLoss: {
    method: 'POST',
    path: 'tokencard/report_loss',
    desc: '微众卡挂失',
    request: {
      op_type: '' // 挂失类型, 1--只挂失虚拟卡 2--只挂失实体卡 3--虚拟卡实体卡一起挂失 STRING
    },
    response: {
      ret_code: '', // 错误码 INT
      ret_msg: '' // 错误描述 STRING
    }
  },

  // 微众卡挂失解挂
  cancelReportLoss: {
    method: 'POST',
    path: 'tokencard/cancel_regloss',
    desc: '微众卡挂失解挂',
    request: {
      op_type: '', // 解除挂失类型，1--只解挂虚拟卡,2--只解挂实体卡，3--虚拟卡和实体卡一起解挂
      face_id: '', // 刷脸id
      artificial_faceck_id: '', // 面核id
      session_id: '' // 效验完密码后返回的加密串这里带上来供后台检查session
    },
    response: {
      process_type: '' // asyn_examine-异步挂失
    }
  },

  // 实体卡激活 ==== start
  /*
   实体卡激活状态查询
   说明：
   当 life_step = 07， life_status = 04，时表示客户核身失败。
   当 life_step = 09， life_status = 04，时表示账户升级不成功。
   当 life_step = 10， life_status = 02，时表示账户升级成功，等待客户激活确认。
   当 life_step = 10， life_status = 04，时表示客户确认不激活。

   当 life_step = 11， life_status = 01，时表示已受理客户激活。
   当 life_step = 11， life_status = 02，时表示执行激活中。
   当 life_step = 11 , life_status = 03，时激活成功。
   当 life_step = 11 , life_status = 04，时激活失败。
   */
  requestTokenCardInfo: {
    // mockable: true,
    path: 'tokencard/status/query',
    desc: '实体卡激活状态查询',
    method: METHOD.GET,
    request: {
      webank_card_no: '6236330070000099331', // 待查询卡号
      cust_no: '0999960000136556' // ecif
    },
    response: {
      type: '01', // 制卡类型  01 已有户，02 新开户，03 换卡. (二期新加)
      face_id: '123456', // 核身刷脸id
      life_step: '10', // 生命周期步骤 11-激活
      life_status: '02', // 生命周期状态 01：初始 02：处理中 03：成功 04：失败
      card_no: '6236330070000099331', // 卡号
      ecif_no: '0999960000136556'
    }
  },
  verifyTokenCardInfo: {
    // mockable: true,
    path: 'tokencard/card_info/verify',
    desc: '实体卡卡面信息校验',
    request: {
      expiry_date: '04/17', // 卡有效期
      cvv2: '886', // cvv
      webank_card_no: '6236330070000099331', // 微众卡号
      cust_no: '0999960000136556' // ecif
    },
    response: {
      sessionEnc: '123456',
      session_id: '123456',
      session_expire_time: '3000' // session 多久失效 单位s
    }
  },
  verifyTokenCode: {
    // mockable: true,
    path: 'tokencard/token_code/verify',
    desc: 'token码校验接口',
    request: {
      token_code: '123456', // token_code
      session_id: '6236330070000099331', // 卡面信息校验session
      ecif_no: '0999960000136556' // ecif
    },
    response: {
      sessionEnc: '123456',
      session_id: '123456',
      session_expire_time: '3000' // session 多久失效 单位s

    }
  },
  /*
   实体卡单独激活
   说明：
   当 life_step = 07， life_status = 04，时表示客户核身失败。
   当 life_step = 09， life_status = 04，时表示账户升级不成功。
   当 life_step = 10， life_status = 02，时表示账户升级成功，等待客户激活确认。
   当 life_step = 10， life_status = 04，时表示客户确认不激活。

   当 life_step = 11， life_status = 01，时表示已受理客户激活。
   当 life_step = 11， life_status = 02，时表示执行激活中。
   当 life_step = 11 , life_status = 03，时激活成功。
   当 life_step = 11 , life_status = 04，时激活失败。
   */
  activeTokenCard: {
    // mockable: true,
    path: 'tokencard/new/solo_activate',
    desc: '实体卡单独激活接口',
    request: {
      card_no: '6236330070000099331', // 待查询卡号
      ecif_no: '0999960000136556', // ecif
      activation: '1', // 客户确认激活结果 1 ： 确认激活.  0 ： 确认不激活(可扩展)
      pin: '123456',
      newpin: '123456',
      session_id: '123456',
      face_id: '123456',
      remake_card: '', // Y-补办激活 N-其他激活
      app_face_id: '123456',
      otp_session_id: '123456'
    },
    response: {
      syscall_id: '', // 任务单号
      type: '', // 制卡类型  01 已有户，02 新开户，03 换卡. (二期新加)
      face_id: '', // 核身刷脸id
      life_step: '11', // 生命周期步骤 11-激活
      life_status: '01', // 生命周期状态 01：初始 02：处理中 03：成功 04：失败
      card_no: Types.string(), // 卡号
      ecif_no: Types.string(),
      pin_day_err: '', // 交易密码当日错误锁定结果  仅验密失败时返回
      pin_count_err: '', // 交易密码连续错误锁定结果  仅验密失败时返回
      pin_left_err_count: '' // 交易密码剩余最大错误次数（交易渠道可根据自己的业务来返回不大于该值的剩余错误次数）  仅验密失败时返回
    }
  },
  verifyOtp: {
    // mockable: true,
    path: 'user/verify_phone_check_num_adm',
    desc: '检验otp',
    request: {
      phone_check_num: '123456', // 查询手机号
      ecif_no: ''
    },
    response: {
      sessionEnc: '123456',
      session_id: '123456',
      session_expire_time: '3000' // session 多久失效 单位s
    }
  },

  preScanCheck: {
    // mockable: true,
    path: 'scan_face/pre_scan_result',
    desc: '检验上次刷脸是否在15分钟内',
    cacheMaxAgeInMs: 0, // 此接口不缓存
    request: {
      face_id: '123456', // 刷脸id
      ecif_no: '1234566'
    },
    response: {
      pre_result: '1' // 0：通过，1：不通过，需要重新刷脸
    }
  },

  checkTokenCardInvitation: {
    // mockable: true,
    path: 'tokencard/invitation/check',
    desc: '检验是否是实体卡预约用户',
    request: {
      personal_identify_no: '123456' // 身份证
    },
    response: {
      openid_exist: 'Y',
      personalid_exist: 'Y'
    }
  },

  // 实体卡和token-补换申请
  reapplyTokenCard: {
    method: 'POST',
    path: 'tokencard/remake/apply',
    desc: '实体卡和token-补换申请',
    request: {
      card_no: '', // 客户webank卡号
      ecif_no: '', // ecif号
      type: '', // 补换类型  11 补卡, 12 补token, 13 补卡和token
      province: '', // 省份
      city: '', // 城市
      borough: '', // 区县
      address: '', // 详细地址
      nationality: '', // 国籍
      profession: '', // 职业
      contacter_name: '', // 联系人
      contacter_phone: '', // 联系人电话
      face_id: '',
      remark: '' // 备注
    },
    response: {
      syscall_id: '' // 任务单号
    }
  },

  // 查询补办状态
  queryReapplyStatus: {
    method: 'POST',
    path: 'tokencard/remake_status/query',
    desc: '查询补办状态',
    request: {
      ecif_no: ''
    },
    response: {
      type: '', // 补办的类型 11 补卡, 12 补token, 13 补卡和token
      mail_company: '', // 邮寄公司
      mail_number: '', // 快递单号
      reapply_status: '', // 补办状态, true--补办流程结束，可以发起补办 false--补办状态处理中，禁止发起补办
      active_status: '', // 是否激活状态
      life_step: '',  // 11-激活
      life_status: ''  // 01-初始 02-处理中 03-成功 04-失败
    }
  },

  // 查询补办次数
  queryReapplyCounts: {
    method: 'POST',
    path: 'tokencard/remake_time/query',
    desc: '查询补办次数',
    request: {
      card_no: '' // 客户webank卡号
    },
    response: {
      max_count: 5,
      card_count: 0, // 储蓄卡补办次数
      token_count: 0 // token补换次数
    }
  },

  // token解锁
  unlockToken: {
    method: 'POST',
    path: 'tokencard/token_unlock/verify',
    desc: 'token激活-刷脸提交',
    request: {
      face_id: '', // 刷脸ID
      cmd_flag: '' // 需要查询的状态'
    },
    response: {
      ret_code: '20270000',
      ret_data: {
      }
    }
  },

  // 拉异步审核列表
  examineJobList: {
    method: METHOD.POST,
    path: 'user/query_examine_joblist',
    desc: '拉异步审核列表',
    request: {
      ori_biz_scene_id: '', // 场景ID
      check_result_list: '', // 需要查询的状态
      check_mode_list: '', // 0: 全部, 1: 错挑对
      ecif_no: '',
      ori_face_id: '',
      ori_biz_no: '' // 原业务流水号
    },
    response: {
      biz_scene: '', // 场景号
      check_result: '' // 异步审核结果
    }
  },
  requestIncomeDateList: {
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    path: 'history/query/new/earnings/datelist',
    desc: '收益明细列表查询--收益的历史时间表',
    request: {
      webank_card: Types.string(), // 微众卡号
      earnings_type: Types.number(), // 收益类型：0 全部 1 理财类 2 投资类
      index: Types.number(), // 分页逻辑 当前数据索引
      page_size: Types.number() // 分页逻辑  每次拉取的数据量
    },
    response: {
      ret_code: '20270000',
      ret_data: {
        earningsHistorys: {
          '20160606': {
            is_earned: '', // 是否已到账
            income: Types.number(), // 到账金额
            prod_code: Types.string() // 产品代码
          }
        }
      }
    }
  },
  requestYesterdayIncomeData: {
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    path: 'history/query/new/earnings',
    desc: '截止到昨日的收益查询(包含昨日总收益和昨日产品收益列表)',
    request: {
      webank_card: Types.string() // 微众卡号
    },
    response: {
      ret_code: '20270000',
      ret_data: {
        last_earnings: Types.number(), // 昨日收益
        earningsHistorys: [ // 产品收益列表
          {
            is_earned: '', // 是否已到账
            income: Types.number(), // 昨日收益金额
            prod_code: Types.string(), // 产品代码
            policy_no: Types.string(), // 保单号 万能险产品才有
            position_gain_and_loss: Types.number(), // 持仓盈亏
            fee: Types.number(), // 手续费
            earnings_date: Types.string() // 收益日期--产品最近一次有收益的日期
          }
        ]
      }
    }
  },
  requestAccumulateIncomeData: {
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    path: 'history/query/new/type_income',
    desc: '累积收益查询接口(包含累计总收益、理财总收益、投资总收益、预估收益)',
    request: {
      webank_card: Types.string() // 微众卡号
    },
    response: {
      ret_code: '20270000',
      ret_data: {
        total_earnings: Types.number(), // 累计总收益
        pre_earnings: Types.number(), // 预估收益
        finance_earnings: Types.number(), // 理财收益
        invest_profit: Types.number() // 投资盈亏
      }
    }
  },
  requestProdInfoByCode: {
    // mockable: false,
    method: METHOD.POST,
    path: 'productinfo/getproductlistbycode',
    desc: '根据产品代码拉取产品信息',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    request: {
      productInfoList: [{name: '11201401-1'}, {name: '11200501-1'}]
    },
    response: {
      productInfoList: [
        {
          changed: true,
          content: `{
            "deposit_code":"11201401-1",
            "fix_term_flag":"1",
            "generate_time":"20170620113021-OA0",
            "img_url":"https://www.webankcdn.net/s/hj/www/img/webank-logo-white-819ae5c02f.png",
            "income_rate_desc":"收益描述",
            "prod_code":"11201401",
            "prod_description":"产品描述1",
            "product_peroid_desc":"周期描述",
            "product_type":"-1",
            "rate_items":[],
              "share_config":{"share_content":"content",
              "share_iconurl":"https://www.webankcdn.net/s/hj/www/img/webank-logo-white-819ae5c02f.png",
              "share_target":"https://www.webankcdn.net/s/hj/www/img/webank-logo-white-819ae5c02f.png",
              "share_title":"title"
            },
            "templet_type":"0"
            }`,
          name: '11201401-1',
          sign: ''
        }
      ]
    }
  },
  // 单日累计转账金额在(5w, 30w]需要出发token码校验
  transferVerifyToken: {
    // mockable: true,
    path: 'finance/token_code/verify',
    desc: '转账时token码校验',
    request: {
      token_code: '123456' // token_code
    },
    response: {
      ret_code: '20270000',
      ret_msg: '11',
      token_verify_session: ''
    }
  },
  // 理财模块
  requestFinancialProductListWithLogin: {
    path: 'productinfo/getfinancepageviewinfoV3',
    desc: '理财列表（已登录）',
    method: METHOD.GET,
    request: {
      // 上次接口返回的 sign 字段，用于后台判断数据是否变化
      sign: ''
    },
    response: {}
  },
  requestFinancialProductListWithOutLogin: {
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    path: 'productinfo/getfinancepageviewinfoV3',
    desc: '理财列表（无登录态）',
    method: METHOD.GET,
    request: {
      // 上次接口返回的 sign 字段，用于后台判断数据是否变化
      sign: ''
    },
    response: {
      // 数据是否发生了变化，如果为 true 则 productTypeList 会包含最新数据，如果为 false 不会包含数据，请使用上次的缓存的数据
      changed: true,
      productTypeList: [{
        productType: '8',
        productTypeDesc: '描述',
        productList: [{
        }],
        generate_time: '20170620161800-OA0'
      }],
      sign: 'da9ef57eff996dffafb7878abbb8cee4'
    }
  },
  requestCalendarData: {
    // TODO: 测试时开启 mockable 和 cacheMaxAgeInMs
    // mockable: true,
    // cacheMaxAgeInMs: 0,
    method: METHOD.GET,
    path: 'calendar/query',
    desc: '获取日历数据',
    request: {
      'startTime': Types.string(),
      'endTime': Types.string(),
      'job_new': Types.string() // 1 代表值获取高净值上制定的计划事件
    },
    response: {
      'calendarEventList': [
        {
          'jobList': [{
            // 计划 id (如果后台用的是流水号，则用流水号填充该字段)
            jobId: 10001,
            // 执行日期
            next_time: '20171120',
            // 结束日期
            end_date: '20180202',
            // 计划类型。 '3': T+1 转出计划为单次计划
            plan_type: '3',
            // '0'表示连续计划，'1'表示非连续计划
            isRepeat: '0',
            // '2'表示转出
            job_type: '2',
            // 名称
            remark: '转账给John',
            // 付款账户描述
            from: '活期+',
            // 收款账户描述
            to: '工商银行（8856）',
            // 收款账户类型，取值：'信用卡', '储蓄卡'
            cartType: '储蓄卡',
            // 金额
            amount: '80000.00',
            // 状态，取值：'1'待执行，'2'撤销中，'3'已撤销, '4'执行成功， '5'执行失败
            status: '1',
            // 流水号
            bizNo: '1709280OA....'
          }],
          'type': '1'
        }, {
          'earningList': [],
          'type': '3'
        }, {
          jobList: [],
          'type': '4'
        }, {
          'type': '5'
        }, {
          'type': '6'
        }, {
          'type': '7',
          turnOutList: [{
            amount: '456123.00',
            bizNo: '154sdfasdfdsfasdfdsfsfwerwer',
            remark: '转账给XX',
            category: '6',
            end_date: '20171204',
            id: 0,
            isRepeat: '0',
            jobId: 0,
            job_type: '2',
            next_time: '20171201',
            plan_type: '3',
            status: '00',
            succ: false
          }, {
            amount: '456123.00',
            bizNo: '154sdfasdfdsfasdfdsfsfwerwer',
            remark: '转账给YY',
            category: '6',
            end_date: '20171204',
            id: 0,
            isRepeat: '0',
            jobId: 1,
            job_type: '2',
            next_time: '20171201',
            plan_type: '3',
            status: '00',
            succ: false
          }]
        }
      ]
    }
  },
  requestCalendarTPlusHistory: {
    method: METHOD.GET,
    path: 'calendar/job/tplus/history',
    desc: '查询T+1大额转账计划历史',
    request: {},
    response: {
      'inValidList': [
        {
          'amount': '12727427.00',
          'bizNo': '23424242',
          'category': '6',
          'end_date': '20171122',
          'id': 0,
          'isRepeat': '0',
          'jobId': 0,
          'job_type': '2',
          'next_time': '20171122',
          'plan_type': '3',
          'status': '01',
          'succ': false
        }
      ],
      'validList': [
        {
          'amount': '456123.00',
          'bizNo': '154sdfasdfdsfasdfdsfsfwerwer',
          'category': '6',
          'end_date': '20171121',
          'id': 0,
          'isRepeat': '0',
          'jobId': 0,
          'job_type': '2',
          'next_time': '20171121',
          'plan_type': '3',
          'status': '00',
          'succ': false
        }
      ]
    }
  },
  addPlan: {
    // mockable: true,
    method: METHOD.POST,
    desc: '添加计划',
    path: 'job/add',
    request: {
      trans_type: Types.number(), // 计划转账类型：1，转入 2，转出
      name: Types.string(), // 计划名称
      type: Types.string(), // 计划频率类型：1 每月一次  2 每日一次 3 单次计划（某天） 4 2小时后任务（制定日期是当天）
      end_date: Types.string(), // 结束日期（有效期）：type为1 201709 type为2 20170905 type为3时 '';长期为9000
      category: Types.string(), // 计划分类： 1自定义计划 2 存工资  3还房贷  4 交房租 5 孝敬父母
      card_no: Types.string(), // 卡号：转出时为收款账号的卡号，转入时为付款账号的卡号
      personal_name: Types.string(), // 卡用户名：转出时为收款账号的卡用户名，转入时为付款账号的卡用户名
      amount: Types.number(), // 金额
      use_wecard: Types.boolean() // true 表示微众卡转入或微众卡转出
    },
    response: {
      status: 1, // 1 代表成功
      next_batch_date: 2, // 下一次跑批日期
      next_succ_date: 3  // 下一次跑批到账日期
    }
  },
  /**
   * 2018年06月19日
   * 目前只支持单词和按月计划的计算
   */
  requestPlanSchedule: {
    // mockable: true,
    method: METHOD.GET,
    desc: '活期+转出交易日试算(计划的详细列表)',
    path: 'job/try',
    request: {
      trans_type: Types.string(),
      type: Types.string(),
      // 如果是单次计划，这里填YYYYMMDD格式的日期，如果是按月，这里填是几号
      day: Types.string(),

      // 如果是按月计划，这里填YYYYMM格式的日期, 如果是单次，留空
      end_date: Types.string()
    },
    response: {
      status: 1, // 1 代表成功
      min_next_date: '2018-06-15',
      itemList: [
        {
          next_batch_date: '2018-06-30', // 下一次跑批日期，按月计划返回
          next_succ_date: '2018-07-01',  // 下一次跑批到账日期，按月计划返回
          next_date: '2018-07-01' // 对于按月计划, 返回下一次计划日期; 对于单次计划
        }
      ]
    }
  },

  requestFinanceCancelProduct: {
    method: METHOD.POST,
    path: 'insurance/cancel_buy',
    desc: '取消理财产品购买（包含活期+）',
    request: {
      trans_serno: Types.string(),
      user_pwd: Types.string(),
      prod_code: Types.string()
    },
    response: {}
  },
  updateUnlockMode: {
    method: METHOD.POST,
    path: 'password/set/scene_pwd_type',
    desc: '设置优先解锁模式，0手势1指纹',
    request: {
      'type': Types.string(),
      'scene': 'login'
    }
  },
  submitNewGesturePassword: {
    method: METHOD.POST,
    path: 'password/insert_update',
    desc: '上传新的手势密码',
    request: {
      'type': Types.number(),
      'password': Types.string(),
      'session_id': Types.string()
    }
  },
  requestEachPayType: {
    // mockable: true,
    method: METHOD.GET,
    path: 'user/setting/type',
    desc: '获取各个类型支付开通状况',
    request: {
      type: Types.string() // 类型
    },
    response: {
      ret_code: '20270000',
      ret_msg: 'succ',
      ret_data: {
        qq: Types.boolean(),
        wx: Types.boolean(),
        jd: Types.boolean(),
        union: Types.boolean(),
        apple: Types.boolean()
      }
    }
  },
  unbindOpenID: {
    method: METHOD.POST,
    path: 'finance/account/unbind_openid',
    desc: '解绑openid',
    request: {
      user_pwd: Types.string()
    }
  },
  modifyPassword: {
    method: METHOD.POST,
    path: 'user/password/modify',
    desc: '修改密码，需要旧密码',
    request: {
      session_id: Types.string(),
      user_pwd: Types.string(),
      otp_session_id: Types.string()
    }
  },
  precheckPassword: {
    method: METHOD.POST,
    path: 'user/password/pre_check',
    desc: '预检查密码复杂度',
    request: {
      user_pwd: Types.string()
    }
  },
  resetPassword: {
    method: METHOD.POST,
    path: 'user/password/reset/v3',
    desc: '设置密码V3(所有用户都会走异步审核)',
    request: {
      user_pwd: Types.string(),
      face_id: Types.string(),
      artificial_faceck_id: Types.string(),
      otp_session_id: Types.string(),
      faceck_flag: Types.string()
    }
  },
  resetPasswordV4: {
    method: METHOD.POST,
    path: 'user/password/reset/v4',
    desc: '设置密码V4(所有用户都会走异步审核) + 无需otp',
    request: {
      user_pwd: Types.string(),
      face_id: Types.string(),
      artificial_faceck_id: Types.string(),
      otp_session_id: Types.string(), // 一个不为空的任意值
      faceck_flag: Types.string()
    }
  },
  depositCoreDate: {
    method: METHOD.GET,
    path: 'deposit/core_date',
    desc: '核心日期查询',
    cacheMaxAgeInMs: 600000,
    request: {},
    response: {}
  },
  depositBuy: {
    method: METHOD.POST,
    path: 'deposit/buy',
    desc: '存款购买',
    request: {
      // 服务端产品代码
      prod_code: Types.string(),
      // 存款期限, 格式形如 '3M'、'1Y'
      deposit_term: Types.string(),
      // 购买金额
      trans_amt: Types.number(),
      // 交易密码 RSA
      password: Types.string(),
      // 备注
      remark: Types.string(),
      // 支付类型
      pay_flag: Types.enum([...Object.values(PayType)]),
      // 活期+产品代码, 值为固定为'001234'，仅当支付类型为活期+时需要填 注：多货基版本不固定，不需要传code
      pay_prod_id: Types.string(),
      // 付款账户卡号，仅当支付类型为他行卡时需要填
      payer_acct: Types.string(),
      // 到期自动赎回类型
      redeem_type: Types.enum([...Object.values(RedeemType)]),
      // 交易货币代码, '01' 为人民币, 这里值固定为 '01'
      ccy: Types.string().fixValue('01'),
      // 定期标识，取值"1"
      fix_term_flag: Types.string().fixValue('1'),
      // 派息频率，仅购买存本取息存款需要填
      interest_term: Types.string().fixValue('1M')
    }
  },
  depositInterestPilotCalc: {
    method: METHOD.GET,
    path: 'deposit/query/redeem_fee_info',
    desc: '存款利息试算',
    request: {
      // 服务端产品代码
      prod_code: Types.string(),
      // 存单号
      subaccount_serial_no: Types.string(),
      // 购买金额
      trans_amt: Types.number()
    },
    response: {}
  },
  depositRedeem: {
    method: METHOD.POST,
    path: 'deposit/redeem',
    desc: '存款赎回',
    request: {
      // 存单号
      subaccount_serial_no: Types.string(),
      // 赎回金额
      trans_amt: Types.number(),
      // 服务端产品代码(不带'-1')
      prod_code: Types.string(),
      // 赎回账户类型
      redeem_type: Types.string(),
      // 活期+支付码(仅当赎回账户为活期+时需要)
      pay_product_code: Types.string(),
      // 交易密码的 RSA
      password: Types.string(),
      // 交易货币代码, '01' 为人民币
      ccy: Types.string().fixValue('01'),
      // 定期标志，取值为 "1"
      fix_term_flag: Types.string().fixValue('1')
    }
  },
  depositRedeemModify: {
    method: METHOD.POST,
    path: 'deposit/modify/redeem_type',
    desc: '存款赎回方式修改',
    request: {
      // 存单号
      subaccount_serial_no: Types.string(),
      // 服务端产品代码（不带'-1'）
      prod_code: Types.string(),
      // 新的赎回方式
      redeem_type: Types.string(),
      // 交易密码的 RSA
      password: Types.string(),
      /* 下面'interest_*'字段仅当利息赎回方式为他行卡时才需要传 */
      // 利息收款账户姓名
      interest_payee_acct_name: Types.string(),
      // 利息收款账户银行卡号
      interest_payee_acct: Types.string(),
      // 利息收款账户银行图标编号
      interest_payee_opbk: Types.string(),
      // 利息收款账户银行名称
      interest_bank_name: Types.string()
      // 是否是同名卡（绑定卡）, '0'非同名,'1'同名 【不需要传，后台会判断是否同名】
      // interest_same_name: Types.enum(['1', '0'])
    }
  },
  depositInterestRateTable: {
    path: 'deposit/query/product_info',
    method: METHOD.GET,
    desc: '查询存款利率表',
    request: {
      // 产品代码（服务端，不带'-'）
      prod_code: Types.string(),
      // 起息日期，如'yyyy-mm-dd'
      effective_date: Types.string()
    },
    response: {
      'hj_biz_no': '171109021020276z7kFVCfTFiJ3I3RbI',
      'process_type': 'sync',
      'ret_code': '20270000',
      'ret_data': [{
        'baserate': 0.35000000, 'centralbank_rate': 0.350000, 'currency_code': '01', 'effective_rate': 0.35000000, 'inst_type': 'DAOQIILX', 'rate_id': 'BASE0001', 'rate_type': '2', 'rates_effective_date': '20151025', 'rates_float_point': 0, 'rates_float_ratio': 0, 'rates_float_type': '0', 'rates_money_code': 0, 'rates_term_code': '0D', 'rates_uneffective_date': '20991231'
      }],
      'ret_msg': '请求成功',
      'token_status': 'OK'
    }
  },
  depositInterestRateTableBatch: {
    path: 'deposit/query/product_info_batch',
    desc: '!!!批量!!!查询存款利率表',
    method: METHOD.GET,
    request: {
      // 产品代码（服务端，不带'-'）
      prod_code: Types.string(),
      // 起息日期，如'yyyy-mm-dd'
      effective_date: Types.string()
    },
    response: {}
  },
  deposit: {
    queryReservationList: {
      path: 'deposit/query/appointment_buy_order',
      desc: '查询存款预约列表',
      method: METHOD.GET,
      request: {
        // 可以根据deposit_type和prod_code来返回
        deposit_type: '',
        prod_code: '', // 不传表示返回所有
        term_id: '' // 大额存单特有的产品期数，其他存款不用传
      },
      response: {
        ret_code: '20270000',
        ret_data: {
          total_count: 12,
          cycle: [
            {
              biz_seq: '',
              prod_code: '',
              term_id: '',
              trans_amt: 1.23,
              deposit_time: '20180909',
              interest_start_day: '20180912'
            }
          ]
        }
      }
    },
    queryInterestOfBigRedeem: {
      path: 'deposit/query/merge_redeem_fee_info',
      desc: '查询合并支取的利息',
      method: METHOD.GET,
      request: {
        product_id: '', // 取出产品的code
        princ_amount: 12, // 取出金额
        need_detail_list: true // 是否需要取出的详细列表
      },
      response: {
        total_interest_amount: 12, // 总利息
        list_sub_acct: [ // 取出详情列表
          {
            subaccount_serial_no: '',
            princ_amount: 13, // 该笔存单取出金额
            effective_rate: '4.05', // 取出利率
            interest_amount: 12, // 利息
            value_date: '20180808' // 气息日期
          }
        ]
      }
    },
    assetTransferOrderList: {
      method: METHOD.GET,
      path: 'deposit/transfer/order_list',
      desc: '转让列表',
      request: {
        subaccount_serial_no: '', // 子账户序号
        inquiry_field: '', // 排序字段 MATURITY：到期时间排序 APR:挂单年利率排序 TXN_AMT:转让价排序
        inquiry_order: '', // 顺序/倒序查询 1-时间倒序,默认时间顺序
        per_return_rows: '', // 返回行数
        first_inquiry_flg: '', // 首次查询标志 2-仅返回总行数 1-首次 0-非首次
        starting_row: '', // 起始行数
        use_cache: ''
      },
      response: {}
    },
    assetTransferOrderListWithOutLogin: {
      method: METHOD.GET,
      path: 'productinfo/getdeposittransferlist',
      cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
      desc: '转让列表', // 未登陆态
      request: {
        subaccount_serial_no: '', // 子账户序号
        inquiry_field: '', // 排序字段 MATURITY：到期时间排序 APR:挂单年利率排序 TXN_AMT:转让价排序
        inquiry_order: '', // 顺序/倒序查询 1-时间倒序,默认时间顺序
        per_return_rows: '', // 返回行数
        first_inquiry_flg: '', // 首次查询标志 2-仅返回总行数 1-首次 0-非首次
        starting_row: '' // 起始行数
      },
      response: {}
    }
  },
  modifyPhoneNoWithFaceId: {
    method: METHOD.POST,
    path: 'finance/account/modify_phoneno/v3',
    desc: '修改手机号（刷脸）',
    request: {
      phone_no: Types.string(),
      otp_session_id: Types.string(),
      face_id: Types.string(),
      session_id: Types.string()
    }
  },
  verifyNewPhoneCheck: {
    method: METHOD.POST,
    path: 'user/veriry_newphone_check',
    desc: '手机号+OTP换取otp_session_id',
    request: {
      phone_no: Types.string(),
      phone_check_num: Types.string()
    }
  },
  deleteGroup: {
    method: METHOD.POST,
    path: 'rich/transfer/delete_group',
    desc: '从好友组中解绑银行卡',
    request: {
      group_name: Types.string(),
      bank_nos: Types.string()
    },
    response: {
      ret_code: '20270000',
      ret_msg: 'succ',
      ret_data: {
      }
    }
  },
  requestTransferAmount: {
    method: METHOD.GET,
    path: 'rich/transfer/query_transfer_amount',
    desc: '查询转账金额',
    request: {
      opposite_name: Types.string(),
      opposite_acct_list: Types.string()
    },
    response: {
      ret_code: '20270000',
      ret_msg: 'succ',
      ret_data: {
        webank_card_no: Types.string(),
        out_times: Types.number(),
        in_times: Types.number(),
        total_in_amt: Types.number(),
        total_out_amt: Types.number()
      }
    }
  },
  changeFeedbackReadStatus: {
    path: '/dbdcss/feedback/viewmsg',
    desc: '更新已读状态',
    cgiPrefix: ServerPrefixType.Q_CLOUD_FB,
    method: METHOD.POST,
    request: {
      id_list: [Types.string().range(5, 10)]
    },
    response: {
      result: '1' // 0 失败 1成功
    }
  },
  updateRedDotPositionStatus: {
    path: 'dbdcss/feedback/updatepositionstatus',
    cgiPrefix: ServerPrefixType.Q_CLOUD_FB,
    desc: '根据红点类型和位置更新标记已读',
    method: METHOD.POST,
    request: {
      msg_type: '', // 什么系统的红点
      position_list: [] // 那些位置被点击过
    },
    response: {
      position: 'sidebar',
      result: '1' // 0 失败 1成功
    }
  },
  queryAccountLevel: {
    method: METHOD.GET,
    path: 'user/query_webank_card/check_strong',
    desc: '根据微众卡号检查该用户是I类户还是II类户',
    request: {
      card_no: Types.string()
    },
    response: {
      ret_code: '2027000'
    }
  },
  // hj 计划列表接口
  requestPlanList: {
    // mockable: true,
    method: METHOD.GET,
    desc: '计划列表',
    path: 'schedule/list',
    request: {
    },
    response: {
      status: 1 // 1 代表成功
    }
  },
  requestHNWPlanList: {
    // mockable: true,
    method: METHOD.GET,
    desc: '计划列表(高净值)',
    path: 'job/list',
    request: {
      protocol_sign: true // 是否查询计划付款卡协议代扣的状态
    },
    response: {
      validList: [
        {
          id: 10001,
          status: 1, // 1 有效 2 暂停 3 过期
          name: '小明', // 计划名称
          type: 1, // 1 每月一次 2 每天一次 3 单次计划（某天） 4 2小时后任务
          day: 6, // type为1时表示每月x号'
          amount: 800000, // 金额
          category: 1, // 1自定义计划 2 存工资  3还房贷  4 交房租 5 孝敬父母
          end_date: '201809',  // type为1 201709 type为2 20170905 其他为空;若为9000，长期
          card_no: '6222222020000000005', // 转入或转出卡号
          personal_name: '许**', // 卡姓名
          freq_desc: '每月18号', // 频率描述
          exe_num: 12 // type为1、2时，已执行次数
        },
        {
          id: 10002,
          status: 1, // 1 有效 2 暂停 3 过期
          name: '还房贷', // 计划名称
          type: 1, // 1 每月一次 2 每天一次 3 单次计划（某天） 4 2小时后任务
          day: 6, // type为1时表示每月x号'
          amount: 800000, // 金额
          category: 3, // 1自定义计划 2 存工资  3还房贷  4 交房租 5 孝敬父母
          end_date: '201809',  // type为1 201709 type为2 20170905 其他为空;若为9000，长期
          card_no: '6222222020000000005', // 转入或转出卡号
          personal_name: '许**', // 卡姓名
          freq_desc: '每月18号', // 频率描述
          exe_num: 12 // type为1、2时，已执行次数
        }
      ], // 当前有效计划：更新时间倒序返回,
      inValidList: [
        {
          id: 10003,
          status: 3, // 1 有效 2 暂停 3 过期
          name: '小花', // 计划名称
          type: 1, // 1 每月一次 2 每天一次 3 单次计划（某天） 4 2小时后任务
          day: 6, // type为1时表示每月x号'
          amount: 800000.00, // 金额
          category: 1, // 1自定义计划 2 存工资  3还房贷  4 交房租 5 孝敬父母
          end_date: '201809',  // type为1 201709 type为2 20170905 其他为空;若为9000，长期
          card_no: '6222222020000000005', // 转入或转出卡号
          personal_name: '许**', // 卡姓名
          freq_desc: '每月18号', // 频率描述
          exe_num: 12 // type为1、2时，已执行次数
        },
        {
          id: 10004,
          status: 3, // 1 有效 2 暂停 3 过期
          name: '还房贷', // 计划名称
          type: 1, // 1 每月一次 2 每天一次 3 单次计划（某天） 4 2小时后任务
          day: 6, // type为1时表示每月x号'
          amount: 800000, // 金额
          category: 3, // 1自定义计划 2 存工资  3还房贷  4 交房租 5 孝敬父母
          end_date: '201809',  // type为1 201709 type为2 20170905 其他为空;若为9000，长期
          card_no: '6222222020000000005', // 转入或转出卡号
          personal_name: '许**', // 卡姓名
          freq_desc: '每月18号', // 频率描述
          exe_num: 12 // type为1、2时，已执行次数
        }
      ] // 已暂停或者已结束的计划
    }
  },
  requestAddDonatePlan: {
    // mockable: true,
    method: METHOD.post,
    desc: '添加公益计划',
    path: 'commweal/add_donate_plan'
  },
  requestQueryDonatePlan: {
    // mockable: true,
    method: METHOD.get,
    desc: '查询公益计划数据',
    path: 'commweal/query_donate_plan'
  },
  requestModifyDonatePlan: {
    // mockable: true,
    method: METHOD.get,
    desc: '修改公益计划',
    path: 'commweal/modify_donate_plan'
  },
  requestDonateRunStatus: {
    // mockable: true,
    method: METHOD.get,
    desc: '查询公益状态',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    path: 'commonweal/query_commonweal_config'
  },
  requestDonateList: {
    method: METHOD.get,
    desc: '查询公益资金使用',
    path: 'finance/query/donatelist'
  },
  checkAccountSecurity: {
    method: METHOD.POST,
    path: 'finance/account/security_check',
    desc: '检查账户安全性',
    request: {
      // 安全检测类型，取值为{@link SecurityCheckType}, required
      security_ck_cmd: Types.string(),
      // 安全检测场景，取值为{@link SecurityCheckScene}, optional
      scene_id: Types.string(),
      // 检查该手机号是否被占用, optional
      new_phone_no: Types.string()
    },
    response: {
      ret_code: '2027000',
      ret_data: {
        retcode: 7, // 安全码，0 ：通过，1 ：禁止操作， 2： 验短，3： 验短+扫脸
        retmsg: '',
        session_id: '', // 加密的本次安全监测的结果，供后续操作使用时请求到后台
        session_expire_time: 600
      }
    }
  },
  requestCommonKVConfig: {
    method: METHOD.GET,
    path: 'welfare/queryactivitycommconfig',
    cgiPrefix: ServerPrefixType.OP,
    desc: '通用KV配置',
    request: {
      key: ['HJCOMMON_HWN_PLAN_PROGRAM_CONFIG']
    },
    response: {
      kvList: [
        {
          HJCOMMON_HWN_PLAN_PROGRAM_CONFIG: '{"salaryTotal": 80, "salaryTotalAmount": 8000,"mortgageTotal": 80, "mortgageTotalAmount": 8000, "caringTotal": 80, "caringTotalAmount": 8000,}'
        }
      ]
    }
  },
  requestRiskAssessment: {
    // mockable: true,
    method: METHOD.GET,
    path: 'risk/assessment/query',
    desc: '拉取风险评估后结果',
    request: {},
    response: {}
  },
  submitRiskAssessment: {
    method: METHOD.POST,
    path: 'risk/assessment/submit',
    desc: '提交风险评估结果',
    request: {},
    response: {}
  },
  setConservativeRiskLevel: {
    method: METHOD.POST,
    path: 'risk/assessment/keepstyle_submit',
    desc: '直接设置用户的风险类型为保守型',
    request: {},
    response: {}
  },
  requestUserInfoConfig: {
    method: METHOD.GET,
    path: 'html/config/user_info_config.json',
    staticFile: true, // 静态配置文件，没有retCode
    cgiPrefix: ServerPrefixType.DATA_CGI_PREFIX,
    desc: '用户配置信息拉取',
    request: {},
    response: {}
  },
  /**
   * 验证此faceId或者videoId是否有效, 次接口旨在逐渐将是否能复用的逻辑移到后台
   * 而且错挑对, 对挑错等异步审核的情况, 因为前端不能实时拿到, 所以如果要复用异步审核的结果,
   * 也需要请求后台, 也就需要这个接口
   */
  checkRecentFaceResult: {
    method: METHOD.GET,
    path: 'scan_face/pre_scan_result',
    desc: '验证此faceId或者videoId是否有效',
    request: {
      scene_id: '',
      face_id: '',
      video_id: '',
      scan_type: ''
    }
  },
  requestUserActivityLimitByProduct: {
    method: METHOD.GET,
    path: 'user/querylimit',
    desc: '查询用户可参与活动信息',
    request: {},
    response: {}
  },
  requestProdCard: {
    method: METHOD.GET,
    path: 'welfare/queryprodcard',
    desc: '查询某个产品是否配置有福利卡',
    request: {},
    response: {}
  },
  requestProdNoticeAndAgreementByCode: {
    method: METHOD.POST,
    path: 'bulletin/query',
    desc: '按产品id拉取产品公告和协议文件',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    request: {},
    response: {}
  },
  requestPartRedeemType: {
    path: 'fund/reserve_redeem/query',
    method: METHOD.POST,
    desc: '查询产品部分赎回信息',
    request: {
      fundcode: 'QT001'
    },
    response: {}
  },
  requestProductBalance: {
    path: 'finance/query/regular_balance',
    cacheMaxAgeInMs: 0,
    method: METHOD.GET,
    desc: '查询产品剩余额度',
    request: {
      product_code: 'QT001'
    },
    response: {}
  },
  requestBuyFinanceProduct: {
    path: 'insurance/buy',
    cacheMaxAgeInMs: 0,
    method: METHOD.POST,
    desc: '购买理财产品',
    request: {
      permission_context: ''
    },
    response: {}
  },
  requestQueryOrderStatus: {
    path: 'finance/query/order_status',
    cacheMaxAgeInMs: 0,
    method: METHOD.GET,
    desc: '查询处理中的订单状态',
    request: {
      queryType: 0, // 0-申购，1-赎回，2-转入，3-转出,4-撤销
      transSerno: '17031401002027GphsEupPamaw681ltO',  // 流水号
      prod_code: '0001234'
    },
    response: {}
  },
  requestBuyFinanceLimit: {
    path: 'user/query/buy_limit',
    method: METHOD.GET,
    desc: '查询产品购买限额和是否首次购买标记',
    request: {
      product_code: ''
    },
    response: {}
  },
  requestAllOnSaleCodeHistoryProducts: {
    path: 'productinfo/gethistoryproductlist',
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    desc: '通过OnSaleCode获取所有的往期products信息',
    request: {
      on_sale_code: ''
    },
    response: {
      historyProductList: [],
      onSaleDesc: ''
    }
  },
  requestIndustries: {
    method: METHOD.GET,
    path: 'stock_fund/group/lists',
    desc: '基金板块与热度信息查询',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    request: {},
    response: {}
  },
  /**
   * 请求非开户状态的Banner
   */
  requestBannerWithoutAccount: {
    path: 'productinfo/bannerinfo',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    method: METHOD.GET,
    cacheMaxAgeInMs: 50 * 60000,
    desc: '请求非开户状态的Banner',
    request: {
      bannerTypeList: [],
      sign: ''
    }
  },
  /**
   * 请求开户状态的Banner
   */
  requestBannerWithAccount: {
    path: 'productinfo/bannerinfo',
    method: METHOD.GET,
    cacheMaxAgeInMs: 50 * 60000,
    desc: '请求开户状态的Banner',
    request: {
      bannerTypeList: [],
      sign: ''
    }
  },

  requestModifyPartRedeemType: {
    path: 'fund/reserve_redeem/set',
    desc: '设置部分赎回的处理方式',
    method: METHOD.POST,
    request: {},
    response: {}
  },
  requestInsuranceRedeemType: {
    path: 'insurance/modify_sale_type',
    desc: '设置部分赎回的处理方式',
    method: METHOD.POST,
    request: {},
    response: {}
  },
  requestProdFriendNum: {
    path: 'sns_data/get_prod_friend_num',
    cgiPrefix: ServerPrefixType.OP,
    desc: '获取购买相同产品的好友人数',
    method: METHOD.GET,
    request: {
      prodCode: Types.string(),
      prodType: Types.string()
    }
  },
  setCommontKV: {
    path: 'welfare/set_user_kv',
    cgiPrefix: ServerPrefixType.OP,
    desc: '设置通用KV',
    method: METHOD.POST,
    request: {
      prodCode: Types.string(),
      prodType: Types.string()
    },
    response: {
    }
  },
  getCommontKV: {
    path: 'welfare/get_user_kv',
    cgiPrefix: ServerPrefixType.OP,
    desc: '读取通用KV',
    method: METHOD.GET,
    request: {
    },
    response: {
    }
  },
  uploadOcrImage: {
    path: 'common/upload_pid',
    desc: '上传身份证照片'
  },
  uploadOcrImageV2: {
    path: 'common/upload_pid/v2',
    desc: '上传身份证照片'
  },
  ocrUploadToSecurityDecision: {
    path: 'common/security_decision',
    desc: 'OCR上传接入安全决策接口'
  },
  completeIdInfo: {
    path: 'risk/assessment/ocr_upload/v3',
    desc: '身份信息补录新接口'
  },
  updateAccount3To2: {
    path: 'account_manage/acct3to2',
    desc: '三升二'
  },
  getCSRFToken: {
    path: 'wm-hjhtr/common/csrf_token/get',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    desc: '获取CSRF Token',
    method: METHOD.GET,
    request: {
    },
    response: {
      ret_data: {
        csrf_token: 'xxxxxxxx'
      }
    }
  },
  requestWeloanEntrance: {
    path: 'wm-hjhtr/core/wld/entry/query',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    desc: '微粒贷入口查询',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    request: {},
    response: {
      IS_OPENED: 'Y', // 是否已开通微粒贷,[R][C(1)][Y：是；N：否]
      UNPAID_LOAN_COUNT: '1' // 未结清借据笔数,[R][N]
    }
  },
  requestWeLoanSupportBanks: {
    path: 'wm-hjhtr/core/wld/query/support_banklist',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    desc: '微粒贷查询可用卡列表',
    method: METHOD.GET,
    request: {
    },
    response: {
      BANKINFOS: [
        {
          BANK_NAME: '银行名称',
          BANK_NO: '123456', // 行号
          SINGLE_MAX: 10000, // 单笔限额
          ENABLE: true, // 是否可用
          MSG: '灰卡信息'
        }
        // ......
      ]
    }
  },
  passwordWeLoanRepayRandomNum: {
    path: 'wm-hjhtr/core/random_factor/get',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    desc: '拉取微粒贷还款的验证密码防重因子',
    request: {},
    response: {},
    method: METHOD.GET,
    cacheMaxAgeInMs: 0
  },
  guaranteeList: {
    method: METHOD.GET,
    path: 'protectiveinsurance/guarantee_slip_list',
    desc: '保单列表查询',
    request: {
      query_begin_line: 0,
      query_num: 10
    },
    response: {
      total_count: '',
      cycle: {}
    },
    cacheMaxAgeInMs: 0
  },
  // AIP
  aip: {
    requestFundAIPList: {
      path: 'schedule_plan/query/setting',
      desc: '获取基金定投列表',
      method: METHOD.GET,
      request: {},
      response: {
        cycle: []
      }
    },
    requestGoldAIPList: {
      path: 'gold/schedule/query',
      desc: '获取黄金定投列表',
      method: METHOD.GET,
      request: {},
      response: {
        jobList: []
      }
    },
    requestRecordList: {
      path: 'schedule_plan/query/trans_detail',
      desc: '获取基金定投记录列表',
      method: METHOD.GET,
      request: {
        index: 0,
        size: 0,
        start_date: '20180101',
        end_date: '20180525',
        prod_code: '',
        plan_no: '' // 定投计划编号
      },
      response: {}
    },
    operateFundAIPPlan: {
      path: 'schedule_plan/operate',
      desc: '基金定投维护-增删改',
      method: METHOD.POST,
      request: {},
      response: {}
    }
  },
  requestWelfareCenterHomePage: {
    cacheMaxAgeInMs: 0,
    path: 'welfare_center/home_page',
    cgiPrefix: ServerPrefixType.OP,
    desc: '福利中心主页信息',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  requestWelfareCenterCardList: {
    cacheMaxAgeInMs: 0,
    path: 'welfare_center/card_list',
    cgiPrefix: ServerPrefixType.OP,
    desc: '查询我的福利，参数区分是正常的还是已失效',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  requestWelfareCenterReadAllCard: {
    cacheMaxAgeInMs: 0,
    path: 'welfare_center/read_all_card',
    cgiPrefix: ServerPrefixType.OP,
    desc: '点击进入福利中心调用，清除新卡状态',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  requestWelfareCenterClearCard: {
    cacheMaxAgeInMs: 0,
    path: 'welfare_center/clear_card',
    cgiPrefix: ServerPrefixType.OP,
    desc: '清除过期福利',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  requestWelfareCenterClearNewTag: {
    cacheMaxAgeInMs: 0,
    path: 'welfare_center/clear_new_tag',
    cgiPrefix: ServerPrefixType.OP,
    desc: '清除福利卡new标记',
    method: METHOD.GET,
    request: {},
    response: {}
  },
  installment: {
    accountInfo: {
      path: 'od/installment/query/account_info',
      desc: '【微众贷】查询用户信息',
      method: METHOD.GET,
      request: {
        loan_product_code: '230027',
        req_flag: '1'
      },
      response: {}
    },
    openAccount: {
      path: 'od/installment/open_account',
      desc: '【微众贷】贷款开户',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    openAccountNotify: {
      path: 'od/installment/open_account_notify',
      desc: '【微众贷】开户后异步通知',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    loanInfo: {
      path: 'od/installment/query/loan_info',
      desc: '【微众贷】贷款试算',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    loan: {
      path: 'od/installment/loan',
      desc: '【微众贷】贷款',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    loanNotify: {
      path: 'od/installment/loan_notify',
      desc: '【微众贷】贷款异步通知',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    queryLoanStatus: {
      path: 'od/installment/query/loan_status',
      desc: '【微众贷】贷款状态查询',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    loanReceiptDetail: {
      path: 'od/installment/query/loan_receipt_detail',
      desc: '【微众贷】借据详情',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    batchLoanReceiptDetail: {
      path: 'od/installment/query/batch_loan_receipt_detail',
      desc: '【微众贷】借据详情批量（提前还款页面用到）',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    queryRepayRecordList: {
      path: 'od/installment/query/repay_record',
      desc: '【微众贷】还款列表',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    queryBorrowRecordList: {
      path: 'od/installment/query/loan_record',
      desc: '【微众贷】借款列表',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    repay: {
      path: 'od/installment/batchrepay',
      desc: '【微众贷】还款',
      method: METHOD.GET,
      request: {},
      response: {}
    }
  },
  // 质押贷
  pledgeLoan: {
    queryLoanList: {
//      mockable: true,
      path: 'pledge_loan/status/query',
      desc: '【质押贷】账户信息',
      method: METHOD.GET,
      request: {},
      response: {
        'available_otb': 1000,
        'business_date': '20301128',
        'credit_limit': 900,
        'cycle': [
          {
            'cant_paid_code': '6622CB141',
            'cover_amt': 0,
            'cover_vol': 0,
            'curr_term': 0,
            'day_interest_rate': 0.0002,
            'due_amt': 0,
            'due_interest': 0,
            'due_penalty': 0,
            'due_prin': 0,
            'early_warn_status': 'N',
            'fee': 0,
            'id_code': '652927196104157213',
            'id_type': '01',
            'interest_rate': 0.072,
            'is_can_paid_out': 'N',
            'is_pay_online': 'N',
            'is_trans_posting': 'N',
            'loan_expire_date': '20300807',
            'loan_init_prin': 500,
            'loan_init_term': 1,
            'loan_month': 0,
            'loan_receipt_nbr': 'O0311807198640000010',
            'loan_status': 'F',
            'loan_term_amt': 0,
            'loan_term_interest': 100,
            'loan_term_prin': 110,
            'loan_total_amt': 120,
            'loan_total_interest': 130,
            'loan_total_penalty': 140,
            'loan_total_prin': 150,
            'loan_type': 'ILEP',
            'name': '五号',
            'overdue_days': 0,
            'paid_out_date': '20301128',
            'pay_way': 'W',
            'payee_acct': '6216260000097777',
            'payee_bank_name': '平安银行',
            'payee_bank_no': '313584099990',
            'payer_acct': '6236330070000000537',
            'payer_bank_name': '微众银行',
            'payer_bank_no': '323584000888',
            'pledge_amt': 0,
            'pledge_prod_type': '1',
            'pledge_refund_flag': 'N',
            'pledge_vol': 0,
            'prod_code': '050027',
            'prod_name': '博时信用债纯债债券',
            'refund_mode': '1',
            'reg_nav': 1.2,
            'reg_nav_date': '20170718',
            'register_date': '20291031',
            'total_paid_amt': 528.9,
            'trans_time': '20291031153217',
            'use_of_loan': '个人日常消费',
            'warn_days': 0,
            'warn_nav': 0,
            'warn_threshold': 1.2
          },
          {
            'cant_paid_code': '6622CB141',
            'cover_amt': 0,
            'cover_vol': 0,
            'curr_term': 0,
            'day_interest_rate': 0.0002,
            'due_amt': 0,
            'due_interest': 0,
            'due_penalty': 0,
            'due_prin': 0,
            'early_warn_status': 'N',
            'fee': 0,
            'id_code': '652927196104157213',
            'id_type': '01',
            'interest_rate': 0.072,
            'is_can_paid_out': 'N',
            'is_pay_online': 'N',
            'is_trans_posting': 'N',
            'loan_expire_date': '20300807',
            'loan_init_prin': 500,
            'loan_init_term': 1,
            'loan_month': 0,
            'loan_receipt_nbr': 'O0311807198640000010',
            'loan_status': 'U',
            'loan_term_amt': 0,
            'loan_term_interest': 160,
            'loan_term_prin': 170,
            'loan_total_amt': 180,
            'loan_total_interest': 190,
            'loan_total_penalty': 200,
            'loan_total_prin': 210,
            'loan_type': 'ILEP',
            'name': '五号',
            'overdue_days': 0,
            'paid_out_date': '20301128',
            'pay_way': 'W',
            'payee_acct': '6216260000097777',
            'payee_bank_name': '平安银行',
            'payee_bank_no': '313584099990',
            'payer_acct': '6236330070000000537',
            'payer_bank_name': '微众银行',
            'payer_bank_no': '323584000888',
            'pledge_amt': 0,
            'pledge_prod_type': '1',
            'pledge_refund_flag': 'N',
            'pledge_vol': 0,
            'prod_code': '050027',
            'prod_name': '博时信用债纯债债券',
            'refund_mode': '1',
            'reg_nav': 1.2,
            'reg_nav_date': '20170718',
            'register_date': '20291031',
            'total_paid_amt': 528.9,
            'trans_time': '20291031153217',
            'use_of_loan': '个人日常消费',
            'warn_days': 0,
            'warn_nav': 0,
            'warn_threshold': 1.2
          },
          {
            'cant_paid_code': '6622CB141',
            'cover_amt': 0,
            'cover_vol': 0,
            'curr_term': 0,
            'day_interest_rate': 0.0002,
            'due_amt': 0,
            'due_interest': 0,
            'due_penalty': 0,
            'due_prin': 0,
            'early_warn_status': 'N',
            'fee': 0,
            'id_code': '652927196104157213',
            'id_type': '01',
            'interest_rate': 0.072,
            'is_can_paid_out': 'N',
            'is_pay_online': 'N',
            'is_trans_posting': 'N',
            'loan_expire_date': '20300807',
            'loan_init_prin': 500,
            'loan_init_term': 1,
            'loan_month': 0,
            'loan_receipt_nbr': 'O0311807198640000010',
            'loan_status': 'O',
            'loan_term_amt': 0,
            'loan_term_interest': 220,
            'loan_term_prin': 230,
            'loan_total_amt': 240,
            'loan_total_interest': 250,
            'loan_total_penalty': 260,
            'loan_total_prin': 270,
            'loan_type': 'ILEP',
            'name': '五号',
            'overdue_days': 0,
            'paid_out_date': '20301128',
            'pay_way': 'W',
            'payee_acct': '6216260000097777',
            'payee_bank_name': '平安银行',
            'payee_bank_no': '313584099990',
            'payer_acct': '6236330070000000537',
            'payer_bank_name': '微众银行',
            'payer_bank_no': '323584000888',
            'pledge_amt': 0,
            'pledge_prod_type': '1',
            'pledge_refund_flag': 'N',
            'pledge_vol': 0,
            'prod_code': '050027',
            'prod_name': '博时信用债纯债债券',
            'refund_mode': '1',
            'reg_nav': 1.2,
            'reg_nav_date': '20170718',
            'register_date': '20291031',
            'total_paid_amt': 528.9,
            'trans_time': '20291031153217',
            'use_of_loan': '个人日常消费',
            'warn_days': 0,
            'warn_nav': 0,
            'warn_threshold': 1.2
          },
          {
            'cant_paid_code': '6622CB141',
            'cover_amt': 0,
            'cover_vol': 0,
            'curr_term': 0,
            'day_interest_rate': 0.0002,
            'due_amt': 0,
            'due_interest': 0,
            'due_penalty': 0,
            'due_prin': 0,
            'early_warn_status': 'N',
            'fee': 0,
            'id_code': '652927196104157213',
            'id_type': '01',
            'interest_rate': 0.072,
            'is_can_paid_out': 'N',
            'is_pay_online': 'N',
            'is_trans_posting': 'N',
            'loan_expire_date': '20300807',
            'loan_init_prin': 500,
            'loan_init_term': 1,
            'loan_month': 0,
            'loan_receipt_nbr': 'O0311807198640000010',
            'loan_status': 'Z',
            'loan_term_amt': 0,
            'loan_term_interest': 280,
            'loan_term_prin': 290,
            'loan_total_amt': 300,
            'loan_total_interest': 310,
            'loan_total_penalty': 320,
            'loan_total_prin': 330,
            'loan_type': 'ILEP',
            'name': '五号',
            'overdue_days': 0,
            'paid_out_date': '20301128',
            'pay_way': 'W',
            'payee_acct': '6216260000097777',
            'payee_bank_name': '平安银行',
            'payee_bank_no': '313584099990',
            'payer_acct': '6236330070000000537',
            'payer_bank_name': '微众银行',
            'payer_bank_no': '323584000888',
            'pledge_amt': 0,
            'pledge_prod_type': '1',
            'pledge_refund_flag': 'N',
            'pledge_vol': 0,
            'prod_code': '050027',
            'prod_name': '博时信用债纯债债券',
            'refund_mode': '1',
            'reg_nav': 1.2,
            'reg_nav_date': '20170718',
            'register_date': '20291031',
            'total_paid_amt': 528.9,
            'trans_time': '20291031153217',
            'use_of_loan': '个人日常消费',
            'warn_days': 0,
            'warn_nav': 0,
            'warn_threshold': 1.2
          }
        ],
        'loan_card_no': '8300160100005554',
        'loan_prod_code': '230016',
        'trade_ctrl': 'N'
      }
    },
    queryApplyStatus: {
      path: 'pledge_loan/query/qualification',
      desc: '【质押贷】资格申请',
      method: METHOD.GET,
      request: {},
      response: {}
    },
    queryLoanRecords: {
      path: 'pledge_loan/query/order',
      desc: '【质押贷】借还记录',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    repayLoan: {
      path: 'pledge_loan/in_advance/repay',
      desc: '【质押贷】还款',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    queryRepayStatus: {
      path: 'pledge_loan/in_advance/query',
      desc: '【质押贷】查询还款状态',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    loanAddition: {
      path: 'pledge_loan/fundloan/cover',
      desc: '【质押贷】补充质押物',
      method: METHOD.POST,
      request: {},
      response: {}
    },
    queryRepaySchedule: {
      path: 'pledge_loan/query/repay/details',
      desc: '【质押贷】还款详情',
      method: METHOD.GET,
      request: {},
      response: {}
    }
  },
  requestRegisterCacheInfo: {
    path: 'finance/account/query/reg_before',
    desc: '拉取开户缓存信息',
    cacheMaxAgeInMs: 0
  },
  requestRewardPoint: {
    cacheMaxAgeInMs: 0,
    path: 'op_loyalty/query_point',
    method: METHOD.GET,
    desc: '查询个人总积分'
  },

  /**
   * 查询用户的身份证状态
   */
  requestUserIdCardStatus: {
    path: 'user/ocr/window/query',
    desc: '查询用户的身份证状态',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0
  },

  /**
   * 同名非绑卡信息查询
   * msg_center/get_unbind_card_list
   */
  requestSameNameNoBindCardInfo: {
    path: 'msg_center/get_unbind_card_list',
    desc: '同名非绑卡信息查询',
    cacheMaxAgeInMs: 0 // 此接口不缓存
  },

  /**
   * 首页安全检查
   * msg_center/get_unbind_card_list
   */
  requestSecurityCheck: {
    path: 'finance/account/security_check',
    desc: '安全检测手机号是否重复',
    cacheMaxAgeInMs: 0 // 此接口不缓存
  },

  /**
   * 请求激活强户
   */
  requestActiveAccount: {
    path: 'finance/account/active',
    desc: '激活强户',
    method: METHOD.POST,
    cacheMaxAgeInMs: 0 // 此接口不缓存
  },
  requestRandomId: {
    path: 'weixin_pay/bindcard/random/query',
    method: METHOD.POST,
    desc: '一键绑卡请求随机id'
  },
  welfareListQualifiedActivityV2: {
    path: 'welfare/list_qualified_activity_v2',
    cgiPrefix: ServerPrefixType.OP,
    method: METHOD.GET,
    desc: '检查用户参与的活动列表',
    cacheMaxAgeInMs: 0 // 此接口不缓存
  },
  welfareGetRelatedActivity: {
    path: 'welfare/get_related_activity',
    cgiPrefix: ServerPrefixType.OP,
    method: METHOD.GET,
    desc: '存单参与活动'
  },
  /**
   * 按类型拉取消息
   */
  requestTypeMessageList: {
    // mockable: true,
    path: 'msg_center/gettypemsg',
    desc: '按类型拉取消息',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0, // 此接口不缓存
    request: {
      msgType: 'notice,home_banner',
      richType: 'earning,red,deposit,deposit_welfare,assetreport',
      index: 0
    },
    response: {
      have_next: true,
      msg_list: [
        {
          brief: `{"sub_type":"","banner_url":"html/home_banner/income_v1.html","android_ver":"","ios_ver":"","action":[],"advinfo":[{"color_start":"yellow","color_end":"green","button_name":"测试按钮","button_color":"red","pic_url":"https://test-personal.webank.com/s/hjupload/hjAdmAdminPic/图片1-51510170876.png","refimgid":"339"}],"starttime":1529589833,"endtime":1530194635}`,
          content:
            `{"sub_type":"","banner_url":"html/home_banner/income_v1.html","android_ver":"","ios_ver":"","action":[],"advinfo":[{"color_start":"yellow","color_end":"green","button_name":"测试按钮","button_color":"red","pic_url":"https://test-personal.webank.com/s/hjupload/hjAdmAdminPic/图片1-51510170876.png","refimgid":"339"}],"starttime":1529589833,"endtime":1530194635}`,
          create_time: '2018-06-22 15:20:26',
          label: '',
          msgType: 'home_banner',
          msgid: 658094,
          server_time: '1529654121',
          status: 'U',
          title: '首页广告异形弹窗',
          url_scheme: ''
        },
        {
          brief: '微众银行为你定制的月资产报告已完成，欢迎查看哦！',
          content: '',
          create_time: '2017-06-20 14:22:36',
          extra: '{"expire_date":"20180730","type":"assetreport","accu_open_months":"12","report_date":"201806"}',
          label: '',
          msgType: 'rich',
          msgid: 94638,
          richType: 'assetreport',
          status: 'U',
          title: '201806资产报告出炉',
          url_scheme: '',
          view_time: '2017-06-20 17:43:38'
        }
      ]
    }
  },
  /**
   * 上报阅读了的消息id
   */
  reportReadMessage: {
    path: 'msg_center/viewmsg',
    desc: '上报阅读了的消息id',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0, // 此接口不缓存
    request: {
      msg_id: '658094'
    },
    response: {
    }
  },
  /**
   * 按照类型清空消息
   */
  clearMessageByType: {
    path: 'msg_center/clearmsg',
    desc: '按照类型清空消息',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0, // 此接口不缓存
    request: {
      msgType: 'home_banner'
    },
    response: {
    }
  },
  /**
   * 按照Rich类型清空消息
   */
  clearMessageByRichType: {
    path: 'msg_center/cleartypemsg',
    desc: '按照Rich类型清空消息',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0, // 此接口不缓存
    request: {
      richType: 'red'
    },
    response: {
    }
  },
  /**
   * 广告推荐配置
   */
  requestCheckADCondition: {
    path: 'user/querylimit_base',
    desc: '广告推荐配置',
    method: METHOD.GET,
    request: {
      query_limit_list: []
    },
    response: {
    }
  },
  requestOperateSplashConfig: {
    path: 'get_splash_config',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    staticFile: true,
    desc: '运营闪屏拉取',
    request: {},
    response: {}
  },
  requestNickImg: {
    path: 'util/text2pic',
    desc: '拉取文字图片',
    request: {
      text: '',
      size: '', // 像素
      rgb: '', // 颜色值
      ttf: 'fz_jinglei.TTF'
    },
    response: {}
  },
  getLondonHistoryGoldPrice: {
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    path: 'gold/london_history_price',
    desc: '黄金历史金价',
    request: {
      // 起始日期, YYYYMMDD
      start_date: Types.string,
      // 结束日期, YYYYMMDD
      end_date: Types.string
    }
  },
  requestThreeHandred: {
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    path: 'history/query/stock300',
    desc: '沪深300价格',
    request: {
      // 起始日期, YYYYMMDD
      start_date: Types.string,
      // 结束日期, YYYYMMDD
      end_date: Types.string
    }
  },
  // 获取基金历史数据
  getFundHisNAV: {
    method: METHOD.GET,
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX,
    path: 'history/query/stock_rates', // 请求路径,
    desc: '股基历史净值', // 接口功能描述, 后续用于数据分析,
    request: {
      prod_code: '',
      start_date: '',
      end_date: ''
    },
    response: {
      '20171201': {
        accu_net_value: 1.945,
        adjust_unit_net_value: 1.945,
        earnings_rate_date: '20171201',
        prod_code: '000584',
        prod_type: '',
        unit_net_value: 1.945,
        ups_downs_rate: 1.95
      }
    }
  },
  requestWeProductOutline: {
    path: 'wm-hjhtr/core/common/business/query',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    desc: '行内业务产品概要',
    request: {
      business_code_list: [] // 业务码list
    },
    response: {
      ret_data: {
        business_detail_map: '{weichedai: {loan_order_count: 5, repaying_order_count: 2, repaid_order_count: 3}}' // string 业务详情
      }
    }
  },
  htrVerifyPassword: {
    path: 'wm-hjhtr/core/password/verify',
    cgiPrefix: ServerPrefixType.SDK_PREFIX,
    method: METHOD.POST,
    desc: 'wm-hjhtr系统单独验密',
    request: {
      password: '' // 是 String 交易密码
    },
    response: {
      ret_data: {
        session: '', // String 验密session
        expire_time: 121212 // int 过期时间
      }
    }
  },
  requestSystemTime: {
    path: 'common/systimeinfo',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    desc: '获取系统时间',
    request: {},
    response: {
      ret_data: {}
    }
  },
  queryApplyTimes: {
    // mockable: true,
    path: 'proof/query/times',
    method: METHOD.POST,
    desc: '查询本周微众卡交易流水和资产证明各自已开具次数',
    request: {},
    response: {
      count_trans: 0,
      trans_times_limit: 1,
      count_asset: 0,
      asset_times_limit: 1,
      count_deposit: 0,
      deposit_times_limit: 1
    }
  },
  /**
   * 获取管理端配置的公告
   */
  queryNoticeWithLogin: {
    mockable: false,
    path: 'productinfo/noticeinfo',
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    desc: '获取管理端配置的公告(已登录)',
    request: {},
    response: {
      noticeinfo: [{
        id: '1',
        type: 'marquee',
        title: '公告标题1',
        content: '公告内容1',
        button: '按钮文案1',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: ''
        }]
      },
      {
        id: '2',
        type: 'yellow',
        title: '公告标题2',
        content: '公告内容2',
        button: '按钮文案2',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: ''
        }, {
          path: 'deposit/DepositAreaScene',
          position_id: 'YellowNoticeOnHeader'
        }, {
          path: 'finance/FinanceHomeMoreScene',
          position_id: 'YellowNoticeOnHeader'
        }, {
          path: 'fund/FundAreaScene',
          position_id: 'YellowNoticeOnHeader'
        }, {
          path: 'gold/GoldAreaScene',
          position_id: 'YellowNoticeOnHeader'
        }]
      },
      {
        id: '6',
        type: 'yellow',
        title: '公告标题2',
        content: '公告内容2',
        abstract: '很长很长的摘要很长很长的摘要很长很长的摘要很长很长的摘要很长很长的摘要很长很长的摘要很长很长的摘要很长很长的摘要',
        button: '按钮文案2',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'fund/FundAreaScene',
          position_id: 'YellowNoticeOnHeader'
        }, {
          path: 'gold/GoldAreaScene',
          position_id: 'YellowNoticeOnHeader'
        }]
      },
      {
        id: '3',
        type: 'gray',
        title: '公告标题3',
        content: '公告内容3',
        button: '按钮文案3',
        abstract: '小灰条公告小灰条公告小灰条公告小灰条公告小灰条公告小灰条公告小灰条公告小灰条公告小灰条公告',
        action: {
          action_type: '1',
          action_param: '',
          prod_: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: ''
        }, {
          path: 'gold/CurrentGoldProductDetailScene',
          position_id: 'GrayNoticeAboveButtonUnpurchased'
        }, {
          path: 'gold/CurrentGoldProductDetailScene',
          position_id: 'GrayNoticeAboveButtonPurchased'
        }, {
          path: 'gold/FixedGoldProductDetailScene',
          position_id: 'GrayNoticeAboveButtonUnpurchased_20002'
        }, {
          path: 'gold/FixedGoldProductDetailScene',
          position_id: 'GrayNoticeAboveButtonPurchased_20002'
        }]
      },
      {
        id: '5',
        type: 'gray',
        title: '公告标题5',
        content: '公告内容5',
        button: '按钮文案5',
        abstract: '小灰条公告',
        action: {
          action_type: '1',
          action_param: '',
          prod_: ''
        },
        path_id_list: [{
          path: 'gold/GoldAssetScene',
          position_id: 'GrayNoticeAboveButton'
        }]
      },
      {
        id: '4',
        type: 'dialog',
        title: '公告标题4',
        content: '公告内容4',
        button: '按钮文案4',
        action: {
          jump_param: 'eyJpb3NNaW5WZXIiOjM4MCwiYW5kcm9pZE1pblZlciI6MzA0MCwiYWN0aW9uX3BhcmFtIjoiL2xvZ2luL0lEQ2FyZExvZ2luU2NlbmUiLCJzY2VuZV9wYXJhbSI6eyJhY3Rpdml0eV9pZCI6ImdmZGdmZGZkIiwiQURUQUciOiJnZmRnZmRmZC5hcHAucHVzaCIsImNoYW5uZWxfaWQiOiJhcHAucHVzaCJ9fQ==',
          moudle_type: '3', // 类型
          sub_type: '1' // 是否需要登录，'1':需要登录
        },
        path_id_list: [
          {
            path: 'home/UnLoginHomeTab',
            position_id: ''
          },
          {
            path: 'setting/',
            position_id: ''
          }
        ]
      }]
    }
  },
  /**
   * 获取管理端配置的公告
   */
  queryNoticeWithoutLogin: {
    mockable: false,
    path: 'productinfo/noticeinfo',
    cgiPrefix: ServerPrefixType.TENCENT_CGI_PREFIX2,
    method: METHOD.GET,
    cacheMaxAgeInMs: 0,
    desc: '获取管理端配置的公告(未登录)',
    request: {},
    response: {
      noticeinfo: [{
        id: '1',
        type: 'marquee',
        title: '公告标题1',
        content: '公告内容1',
        abstract: '公告摘要1',
        show_always: false,
        button: '按钮文案1',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: 'UnLoginHomeTab'
        }]
      },
      {
        id: '2',
        type: 'yellow',
        title: '公告标题2',
        content: '公告内容2',
        abstract: '公告摘要2',
        button: '按钮文案2',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: 'UnLoginHomeTabD'
        }]
      },
      {
        id: '3',
        type: 'gray',
        title: '公告标题3',
        content: '公告内容3',
        abstract: '公告摘要2',
        button: '按钮文案3',
        action: {
          action_type: '1',
          action_param: '',
          prod_code: ''
        },
        path_id_list: [{
          path: 'home/UnLoginHomeTab',
          position_id: ''
        }]
      },
      {
        id: '4',
        type: 'dialog',
        title: '公告标题4',
        content: '公告内容4',
        button: '按钮文案4',
        show_always: true,
        action: {
          jump_param: 'eyJpb3NNaW5WZXIiOjM4MCwiYW5kcm9pZE1pblZlciI6MzA0MCwiYWN0aW9uX3BhcmFtIjoiL2xvZ2luL0lEQ2FyZExvZ2luU2NlbmUiLCJzY2VuZV9wYXJhbSI6eyJhY3Rpdml0eV9pZCI6ImdmZGdmZGZkIiwiQURUQUciOiJnZmRnZmRmZC5hcHAucHVzaCIsImNoYW5uZWxfaWQiOiJhcHAucHVzaCJ9fQ==',
          moudle_type: '3', // 类型
          sub_type: '1' // 是否需要登录，'1':需要登录
        },
        path_id_list: [
          {
            path: 'home/UnLoginHomeTab',
            position_id: 'UnLoginHomeTab'
          },
          {
            path: 'setting/AccountAndSecurityScene',
            position_id: 'AccountAndSecurityScene'
          }
        ]
      }]
    }
  }
}

const keyMirror = require('fbjs/lib/keyMirror')
cgiConfig.keys = keyMirror(cgiConfig)
export default cgiConfig
export {
  METHOD
}
