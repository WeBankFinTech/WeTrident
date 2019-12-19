import { PopupStub } from '@unpourtous/react-native-popup-stub'

export default class Popup {
  /**
   *
   * @param content - 任何可以渲染的React元素
   * @param options - 配置参数
   */
  static show (content, options) {
    return PopupStub.addPopup(content, options)
  }

  static hide (id) {
    PopupStub.removePopup(id)
  }
}
