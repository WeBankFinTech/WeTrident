/**
 * 路由接口的类型定义，增强 IDE 智能提示，使用 TypeScript 编写类型定义
 *
 * 该文件是可选文件，删除或错误不会影响代码正常运行，最终也不会被打包
 */

interface AppNavigatorStatic {
  new (): AppNavigator
}

type StringLike = string | {toString(): string}

interface AppNavigator {
  /**
   * 返回指定页面
   *
   * 示例：
   * 1)假设页面堆栈为 A->B->C->D
   * * 在 D 页面调用 goBack() 返回 C
   * * 在 D 页面调用 goback('B') 返回 B
   *
   * 2) 假设页面 D 是一个公共页面，存在多种路径跳转过来：A->B->C->D, E->F->D
   * * 在 D 页面调用 goBack(['A', 'E'])，如果从 A 跳转过来返回 A，如果从 E 条转过来返回 E
   *
   * 提示：为了避免字面值，推荐使用 AppNavigator.home.HomeScene 替代 'HomeScene' 字面值
   *
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   */
  goBack(routeNames?: StringLike | StringLike[]): void

  /**
   * 返回指定页面，并使用新页面替换
   *
   * 示例：
   * 1）假设页面路径可能为：
   * A -> C -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace(C, B)
   *
   * 2)假设页面路径如下，D 页面有多重可能的返回路径：
   * A -> C -> D
   * A -> E -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace([C, E], B)
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   * @param {string|{routeName: string, params: any}} newRouter 新页面的路由
   *    可以是字符串（页面名称）或者是对象（必须包含routeName表示页面名称以及可选的页面参数 params）
   */
  goBackAndReplace(
    routeNames: StringLike | StringLike[],
    newRouter: StringLike | {routeName: StringLike, params?: any}
  ): void
  goBackThenPush(
    routeNames: StringLike | StringLike[],
    newRouter: StringLike | {routeName: StringLike, params?: any}
  ): void

  login: {
    LoginScene(): void,
    LoginNoticeScene(): void,
    IDCardLoginScene(): void,
    LoginFaceVerifyScene(params: {loginPlatform: string, errorMsg: string}): void,
    LoginOtpScene(params: {loginPlatform: string}): void,
    NoticeInterestScene(): void,
    NoticePostScene(): void,
    OtpLoginGuideScene(params: {loginPlatform: string}): void
  }

  messageNotice: {
    MessageNoticeScene(params: any): void
  }

  calendar: {
    CalendarScene(params: any): void
  }

  weLoan: {
    WeLoanOverdueChannelScene(): void,
    WeLoanOverdueScene(): void,
    WeLoanResultScene(): void,
    WeLoanPrepayScene(): void,
    WeLoanTransDetailScene(): void,
    WeLoanHomeScene(): void,
    WeLoanRepayRecordScene(): void,
    WeLoanBridgeScene(): void
  }

  deposit: {
    StructureDepositIcomeRecordScene(): void,
    StructureDepositTransResultScene(): void,
    StructureDepositTransDetailScene(): void,
    StructureDepositTransInScene(): void,
    StructureDepositHomeScene(): void,
    StructureDepositProductDetailScene(): void,
    DepositAreaScene(): void,
    DepositAreaDetailScene(): void,
    DepositInsuranceScene(): void,
    DepositAssetScene(): void,
    TimeDepositProductDetailScene(): void
    TimeDepositMyProductDetailScene(): void
    TimeDepositPurchaseScene(params: {
      rateItem: object,
      prodInfo: object
    }): void
    TimeDepositResultScene(prams: {
      transType: string,
      transStatus: string,
      extra?: object
    }): void
    TimeDepositReceiptScene(params: {
      serialNo: string
    }): void
    TimeDepositRedeemScene(params: {
      serialNo: string
    }): void
    IntelliDepositProductDetailScene(params: {
      displayPurchasedScene: boolean
    }): void
    IntelliDepositPurchaseScene(params: {
      prodInfo: object
    }): void
    IntelliDepositResultScene(params: {
      transType: string,
      transStatus: string,
      extra?: object
    }): void
    IntelliDepositReceiptScene (params: {
      serialNo: string
    }): void
    IntelliDepositRedeemScene(params: {
      serialNo: string,
      incomeDays: number
    }): void
    PrincipalDepositProductDetailScene(params: {
      displayPurchasedScene: boolean
    }): void
    PrincipalDepositResultScene(params: {
      transType: string
      transStatus: string,
      extra?: object
    }): void
    PrincipalDepositPurchaseScene(params: {
      buyAmount: string,
      prodInfo: object
    }): void
    PrincipalDepositReceiptDetailScene(params: {
      serialNo: string
    }): void
    PrincipalDepositRedeemScene(params: {
      serialNo: string
    }): void
    PrincipalDepositInputOtherBankScene(params: {
      onSelect: Function
    }): void
    DepositBankSelectorScene(params: {
      onPressBankItem: Function
    }): void
    PrincipalDepositSceneHomeScene(params: {
      sceneType: string
    }): void
    PrincipalDepositScenePurchaseScene(params: {
      sceneType: string,
      monthInterest: number,
      prodInfo: object,
      friendInfo: object
    }): void
    PrincipalDepositMindCardScene(param: {
      monthInterest: number,
      firstInterestDate: Date,
      friendInfo: object
    }): void
    DepositContactSelectorScene(params: {
      onPressCard: Function,
      onPressFriend: Function,
      onSelect: Function
    }): void
    PrincipalDepositPayInterestDetailScene(params: {
      accountLevel: 'I'|'II'
    }): void
    PrincipalDepositFriendReceiveIntroScene(): void

  }

  gold: {
    GoldAreaScene(): void
    GoldAssetScene(): void
    GoldWeSubjectScene(): void
    GoldNewsScene(params: {
      // 标题
      title?: string
    }): void
    GoldIntroductionScene(): void
    GoldTransactionRecordsScene(): void
    GoldPriceHistoryScene(params: {
      // 历史金价数据
      historyGoldPriceData: object
    }): void
    GoldMoreDetailScene(params: {
      prodCode: string
    }): void
    GoldIncomeHistoryScene(): void
    CurrentGoldProductDetailScene(params: {
      // true 显示已购页，false 显示未够页
      isPurchased: boolean
    }): void
    CurrentGoldPurchaseScene(params: {
      // reference to {@link PurchaseType} in gold module
      purchaseType: string
    }): void,
    CurrentGoldRedeemScene(parmas: {
      // reference to {@link RedeemType} in gold module
      redeemType: string
    }): void,
    CurrentGoldResultScene(params: {
      // reference to {@link TransType} in gold module
      transType: string,
      // reference to {@link TransStatus} in gold module
      transStatus: string,
      extra: {
        errMsg?: string,
        redeemWeight: number,
        purchaseValue: number,
        purchaseUnit: string,
        valueStartDate: string,
        valueViewDate: string
      }
    }): void,
    CurrentGoldPendingListScene(): void,
    CurrentGoldScheduledListScene(): void,
    CurrentGoldPendingDetailScene(): void,
    CurrentGoldScheduledDetailScene(): void,
    CurrentGoldExtractScene(): void,
    CurrentGoldExtractAddressScene(): void,
    CurrentGoldExtractListScene(): void,
    CurrentGoldExtractDetailScene(params: {
      item: Object
    }): void,
    FixedGoldProductDetailScene(params: {
      // 是否是已购页
      isPurchased: false,
      // 定期金产品代码
      prodCode: string
    } | {
      // 是否是已购页
      isPurchased: true,
      // 定期金产品代码
      prodCode: string,
      // 定期金账户号（同一个定期金每期的 acctNo 都不同）
      acctNo: string
    }): void
    FixedGoldPurchaseScene(params: {
      // 定期金产品代码
      prodCode: string
    }): void,
    FixedGoldRedeemScene(params: {
      // 定期金产品代码
      prodCode: string,
      acctNo: string
    }): void,
    FixedGoldResultScene(params: {
      // reference to {@link TransType} in gold module
      transType: string,
      // reference to {@link TransStatus} in gold module
      transStatus: string,
      extra: {
        errMsg?: string
      }
    }): void
  }

  plan: {
    CommonPlanConfirmScene(params: any): void
    CommonPlanScene(params: any): void
    PlanDetailScene(params: any): void
    PlanExecuteInfoScene(params: any): void
    PlanListScene(params: any): void
    PlanResultScene(params: any): void
    ScenarioPlanConfirmScene(params: any): void
    ScenarioPlanScene(params: any): void
    PlanTaxScene(params: any): void
    PlanTaxModifyScene(params: any): void
    PlanTaxResultScene(params: any): void
    PlanTaxMoreDetailScene(params: any): void
  }

  transfer: {
    AgreementScene(): void
    TransferInScene(params: any): void
    TransferInMoreWayScene(): void
    BankGuideSelectorScene(): void
  }

  setting: {
    EditPhoneNumberScene(params: any): void
  }

  fund: {
    FundTestScene(): void
    FundAreaScene(): void
    FundRankingListScene(): void
    FundSubjectListScene(): void
    FundManagerStarListScene(): void
    FundJackarooAreaScene(): void
    FundSubjectDetailScene(params: {subjectInfo: object}): void
    FundManagerStarDetailScene(params: {managerInfo: object}): void
    FundPopularityRankingScene(params: {popularLevelProds: object}): void
    FundStarChoiceScene(): void
    FundProductDetailScene(params: {prodCode: string, showBuyButton: boolean}): void
    FundHoldingProductDetailScene(params: {prodCode: string}): void
    FundHoldingAssetScene(): void
    FundPurchaseScene(params: {prodCode: string}): void
    FundRedeemScene(params: {prodCode: string}): void
    FundPurchaseResultScene(params: object): void
    FundRedeemResultScene(params: object): void
    FundPurchaseConfirmingScene(params: {prodCode: string}): void
    FundRedeemConfirmingScene(params: {prodCode: string}): void
    FundTransRevokeResultScene(params: object): void
    /**
     * 跳转到基金交易规则页面
     * initialPage 0 购买规则，1 赎回规则
     * @constructor
     */
    FundTransRulesScene(params: {prodCode: string, initialPage: number}): void
    FundHisNAVScene(params: {prodCode: string}): void
    FundAssetAllocationScene(params: {prodCode: string}): void
    FundArchiveScene(params: {prodCode: string}): void
    FundManagerDetailScene(params: {prodCode: string, fundManagerInfo: object}): void
    FundManagerListScene(params: {prodCode: string}): void
    FundTransRecordListScene(params: {prodCode: string}): void
    FundBonusDetailScene(params: {prodCode: string}): void
    FundCompanyScene(params: {prodCode: string, companyName: string}): void
  }
  customerService: {
    CustomerServiceScene():void
  }
  finance: {
    FinanceHomeMoreScene(params: any): void,
    FinanceAreaScene(params: any): void,
    ShortTermHoldingAssetsScene(params: any): void,
    FixTimeHoldingAssetsScene(params: any): void,
    HoldingAssetsScene(params: any): void
  }
  revenue: {
    RevenueProductDetailScene(params: any): void
    RevenueMyProductDetailScene(params: any): void
    RevenueHistoryProductListScene(params: any): void
    RevenueHistoryProductDetailScene(params: any): void
    RevenueProductIntroductionScene(params: any): void
    RevenuePurchaseScene(params: any): void
    RevenuePurchaseResultScene(params: any): void
    RevenueCancelListScene(params: any): void,
    RevenueCancelResultScene(params: any): void,
    PdfViewerScene(params: any): void
  }
  record: {
    TransactionRecordListScene(): void
  }
  risk: {
    RiskInfoScene(params: any): void
  },
  viewer: {
    WebViewScene(params: {
      // 要在 WebView 中展示的资源的 http(s) 地址
      url: string
      // 标题栏--标题
      title?: string,
    }): void
  },
  transaction: {
    TransactionHomeScene(params: any): void,
    PayServiceScene(params: any): void
  },
  register: {
    RegisterHomeScene(params: any): void,
    RegisterInfoStatusErrorScene(params: any): void,
    RegisterResultScene(params: any): void,
    ActiveStrongAccountScene(params: any): void,
    ActiveStrongAccountResultScene(params: any): void,
    ActiveUnionResultScene(params: any): void,
    ExistAccountBindScene(params: any): void
  },
  tplusn: {
    TplusnMyDetailScene(params: {
      policyNo: string,
      prodCode: string
    }): void,
    TplusnDetailScene(params: any): void,
    TplusnPurchaseDetailScene(params: any): void,
    TplusnPurchaseResultScene(params: {
      amount: string,
      prodName: string,
      policyNo: string,
      prodCode: string,
      buyMoment: object
    }): void,
    TplusnPurchaseScene(params: {
      prodCode: string
    }): void,
    TplusnRevokeResultScene(params: any): void
  }
  bindCard: {
    BindMoreCardScene(): void
  }
  equity: {
    LoanIntroduceScene(): void
  }
}


declare const appNavigator: AppNavigator

export = appNavigator
