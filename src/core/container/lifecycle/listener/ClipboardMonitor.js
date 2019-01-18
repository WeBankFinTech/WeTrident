/**
 * Created by erichua on 11/10/2017.
 */

import React from 'react'
import {
  Clipboard,
  DeviceEventEmitter
} from 'react-native'
import LifeCycleLisener from './LifecycleLisener'
import {
  Dialog,
  CustomBannerDialog,
  LocalStorage
} from 'apps/webankPro/bizComponents'
// import { Actions } from 'react-native-router-flux'
import {
  EmitEventType,
  PreferencesKey
} from 'apps/webankPro/constants'
import { Validators } from 'utils'
import PredictTransferDialogBody from '../../components/PredictTransferDialogBody'
import { CGI, WeApi } from '../../../api'
import { AuthManager } from '../../../../../plugins'
import {PopupStub} from '@unpourtous/react-native-popup-stub'
import {AppNavigator} from 'apps/webankPro/navigation'
import HomePopupsBiz from '../../../bizComponents/HomePopupsBiz'

const md5 = require('md5')

export default class ClipboardMonitor extends LifeCycleLisener {
  static ignoredCardNoList = []
  static addIgnoredCardNo (cardNo) {
    ClipboardMonitor.ignoredCardNoList.push(cardNo)
  }

  onAppResume () {
    // 数据没准备好，不弹
    // 手势密码禁止跳转，不跳
    if (!AuthManager.isBankDataReady() || AuthManager.isPreventJump()) {
      return
    }
    Clipboard.getString().then(copiedContent => {
      LocalStorage.loadData(PreferencesKey.clipboardContentMd5Key).then((localStorageContent) => {
        // 要设置回去，不然剪切板会被清空
        Clipboard.setString(copiedContent)
        if (localStorageContent !== md5(copiedContent)) {
          this._tryParseCopiedContent(copiedContent)
        }
      }, () => {
        this._tryParseCopiedContent(copiedContent)
      })
    }, () => {})
    return super.onAppResume()
  }

  _tryParseCopiedContent (copiedContent) {
    if (this._matchVerifyCode(copiedContent)) {
      LocalStorage.saveData(PreferencesKey.clipboardContentMd5Key, md5(copiedContent))
      DeviceEventEmitter.emit(EmitEventType.VERIFY_CODE_MATCHED, copiedContent)
    } else {
      if (HomePopupsBiz.showFinished()) {
        this.tryToShowDialog(copiedContent)
      }
    }
  }

  _matchVerifyCode (copiedContent) {
    return Validators.isValidVerifyCode(copiedContent)
  }

  tryToShowDialog (copiedContent, myWebankCardNo) {
    if (PopupStub.isShow()) {
      return
    }

    ClipboardMonitor.guessSimpleValidCardInfo(copiedContent, myWebankCardNo).then((result = {}) => {
      LocalStorage.saveData(PreferencesKey.clipboardContentMd5Key, md5(copiedContent))

      const id = Dialog.show(<CustomBannerDialog
        banner={require('./../../images/popup_banner.png')}
        body={<PredictTransferDialogBody
          {...result}
          title={`猜你需要转账到以下${result.name ? '账户' : '账号'}`}
          onPressTransfer={() => {
            Dialog.hide(id)
            AppNavigator.transfer.TransferToCardScene({
              payeeCardNo: result.cardNo,
              payeeName: result.name,
              payeeBankName: result.bankName
            })
          }} />}
        onPressClose={() => {
          Dialog.hide(id)
        }}
      />, {
        lock: 'auto',
        zIndex: 50
      })
    }, (error) => {
      console.log(error)
    })
  }

  onAppPause () {
    return super.onAppPause()
  }

  /**
   * {
   *  cardNo：
   *  name:
   *  bankName:
   * }
   * 先写成promise，以后要改成后台检测也比较方便一点，这种规则放后台就超级灵活还可以AI来搞呢
   * @param content
   */
  guessValidCardInfo (content = '', myWeBankCardNo) {
    return new Promise((resolve, reject) => {
      const result = {}
      // 产品要求的是16-21的数字长度，但是考虑到可能四位加空格了，如果是21位，最多需要加5个空格, 所以长度取 16 - 26
      const matchCardResult = content.match(/[\d| ]{16,26}/)
      if (matchCardResult && matchCardResult.length === 1) {
        result.cardNo = matchCardResult[0].replace(/ /g, '')
        if (result.cardNo === myWeBankCardNo) {
          reject()
          return
        }
      } else {
        reject()
        return
      }

      if (ClipboardMonitor.ignoredCardNoList.indexOf(result.cardNo) !== -1) {
        reject()
        return
      }

      const matchNameResult = content.match(/[赵|钱|孙|李|周|吴|郑|王|冯|陈|褚|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|胥][\u4e00-\u9fa5]*\B/g)
      if (matchNameResult && matchNameResult.length === 1 && matchNameResult[0].length <= 3 && matchNameResult[0].length >= 2) {
        const containInvalidText = [
          '农行', '农业', '招行', '招商', '广发', '平安', '光大', '民生', '工行', '工商', '建行', '建设', '中行', '中国', '交行', '交通', '中信', '兴业', '华夏', '浦发', '邮政', '上海', '华融', '江苏', '东亚', '南京', '北京', '杭州', '宁波', '江 >苏', '华润', '华兴', '广州', '深圳', '重庆'
        ].find(item => {
          return matchNameResult[0].indexOf(item) !== -1
        })
        if (!containInvalidText) {
          result.name = matchNameResult[0]
        }
      }

      if (!result.name && content.match(/[\u4e00-\u9fa5].?/g)) {
        reject()
        return
      }

      if (result.name && content.replace(result.name, '').match(/[\u4e00-\u9fa5].?/g)) {
        // 匹配完名字还有其他汉字，则不提示
        reject()
        return
      }

      WeApi.get(CGI.queryBankInfo, {
        account: result.cardNo,
        usage: 'trans_out'
      }).then((response) => {
        if (!response || !response.ret_data) {
          console.warn(CGI.queryBankInfo.desc + ' 失败')
          return
        }
        result.bankName = response.ret_data.bank_name
        resolve(result)
      }, (error) => {
        reject()
        console.log(error)
      })
    })
  }

  /**
   * {
   *  cardNo：
   *  name:
   *  bankName:
   * }
   * 先写成promise，以后要改成后台检测也比较方便一点，这种规则放后台就超级灵活还可以AI来搞呢
   * @param content
   */
  static guessSimpleValidCardInfo (content = '', myWeBankCardNo) {
    return new Promise((resolve, reject) => {
      if (content && content.length > 100) {
        reject()
      }

      const result = {}
      // 产品要求的是16-21的数字长度，但是考虑到可能四位加空格了，如果是21位，最多需要加5个空格, 所以长度取 16 - 26
      const matchCardResult = content.match(/[\d| ]{16,26}/)
      if (matchCardResult && matchCardResult.length === 1) {
        result.cardNo = matchCardResult[0].replace(/ /g, '')
        if (result.cardNo === myWeBankCardNo) {
          reject()
          return
        }
      } else {
        reject()
        return
      }

      if (ClipboardMonitor.ignoredCardNoList.indexOf(result.cardNo) !== -1) {
        reject()
        return
      }

      const matchNameResult = content.match(/[赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福|胥][\u4e00-\u9fa5]*/g)

      if (matchNameResult && matchNameResult.length > 0) {
        for (let i in matchNameResult) {
          let matchName = matchNameResult[i]
          if (matchName.length <= 3 && matchName.length >= 2) {
            const containInvalidText = [
              '农行', '农业', '招行', '招商', '广发', '平安', '光大', '民生', '工行', '工商', '建行', '建设', '中行', '中国', '交行', '交通', '中信', '兴业', '华夏', '浦发', '邮政', '上海', '华融', '江苏', '东亚', '南京', '北京', '杭州', '宁波', '江 >苏', '华润', '华兴', '广州', '深圳', '重庆', '银行'
            ].find(item => {
              return matchName.indexOf(item) !== -1
            })
            if (!containInvalidText) {
              result.name = matchName
              break
            }
          }
        }
      }

      // if (!result.name && content.match(/[\u4e00-\u9fa5].?/g)) {
      //   reject()
      //   return
      // }

      // if (result.name && content.replace(result.name, '').match(/[\u4e00-\u9fa5].?/g)) {
      //   // 匹配完名字还有其他汉字，则不提示
      //   reject()
      //   return
      // }

      WeApi.get(CGI.queryBankInfo, {
        account: result.cardNo,
        usage: 'trans_out'
      }).then((response) => {
        if (!response || !response.ret_data) {
          console.warn(CGI.queryBankInfo.desc + ' 失败')
          return
        }
        result.bankName = response.ret_data.bank_name
        resolve(result)
      }, (error) => {
        reject()
        console.log(error)
      })
    })
  }

  // /**
  //  * {
  //  *  cardNo：
  //  *  name:
  //  *  bankName:
  //  * }
  //  * 先写成promise，以后要改成后台检测也比较方便一点，这种规则放后台就超级灵活还可以AI来搞呢
  //  * @param content
  //  */
  // testCase(content = '', myWeBankCardNo) {
  //   const result = {}
  //   // 产品要求的是16-21的数字长度，但是考虑到可能四位加空格了，如果是21位，最多需要加5个空格, 所以长度取 16 - 26
  //   const matchCardResult = content.match(/[\d| ]{16,26}/)
  //   if (matchCardResult && matchCardResult.length === 1) {
  //     result.cardNo = matchCardResult[0].replace(/ /g, '')
  //     if (result.cardNo === myWeBankCardNo) {
  //       return null
  //     }
  //   } else {
  //     return null
  //   }
  //
  //   const matchNameResult = content.match(/[赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福][\u4e00-\u9fa5]*/g)
  //
  //   if (matchNameResult && matchNameResult.length > 0) {
  //     for (let i in matchNameResult) {
  //       let matchName = matchNameResult[i]
  //       if (matchName.length <= 3 && matchName.length >= 2) {
  //         const containInvalidText = [
  //           '农行', '农业', '招行', '招商', '广发', '平安', '光大', '民生', '工行', '工商', '建行', '建设', '中行', '中国', '交行', '交通', '中信', '兴业', '华夏', '浦发', '邮政', '上海', '华融', '江苏', '东亚', '南京', '北京', '杭州', '宁波', '江 >苏', '华润', '华兴', '广州', '深圳', '重庆'
  //         ].find(item => {
  //           return matchName.indexOf(item) !== -1
  //         })
  //         if (!containInvalidText) {
  //           result.name = matchName
  //           break
  //         }
  //       }
  //     }
  //   }
  //   return result
  // }
}
