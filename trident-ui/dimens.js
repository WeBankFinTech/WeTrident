/**
 * 系统相关的一些值
 */
import {
  StatusBar,
  Platform,
  Dimensions
} from 'react-native'
import Device from './Device'

const Navigator = {
  NavigationBar: {
    Styles: {
      General: {
        StatusBarHeight: 20,
        NavBarHeight: 44
      }
    }
  }
}

const { width, height } = Dimensions.get('window')

const statusBarHeight = Platform.select({ // 导航栏 + 状态栏的高度
  android: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
  // iPhoneX要特殊处理
  ios: Device.isPhoneX() ? 44 : Navigator.NavigationBar.Styles.General.StatusBarHeight
})
export default {
  NAV_BAR_HEIGHT: Platform.select({ // 纯导航栏的高度
    android: Navigator.NavigationBar.Styles.General.NavBarHeight,
    ios: Navigator.NavigationBar.Styles.General.NavBarHeight
  }),
  TOTAL_NAV_BAR_HEIGHT: Navigator.NavigationBar.Styles.General.NavBarHeight + statusBarHeight,
  STATUS_BAR_HEIGHT: statusBarHeight,
  WINDOW_WIDTH: width, // 手机屏幕宽度
  get WINDOW_HEIGHT () {
    const containerHeight = Device.getContainerHeight()
    return Platform.select({ // 部分android因为虚拟按键会导致获取不到真实的可视化区域，动态设置Dimensions，动态获取
      android: containerHeight > height ? containerHeight : height,
      ios: height
    })
  }, // 手机屏幕高度

  CONTENT_HEIGHT: Platform.select({ // 沉浸式页面中实际的可视内容高度
    android: height - (Platform.Version >= 21 ? 0 : StatusBar.currentHeight),
    ios: height
  }),

  PORTRAIT_UNSAFE_AREA_TOP_HEIGHT: Device.isPhoneX() ? 44 : 0, // 顶部安全非区域高度, Home indicator
  PORTRAIT_UNSAFE_AREA_BOTTOM_HEIGHT: Device.isPhoneX() ? 34 : 0, // 底部安全非区域高度, Home indicator
  PORTRAIT_UNSAFE_AREA_BOTTOM_HEIGHT_MINUS_MODULE_HEIGHT: Device.isPhoneX() ? 24 : 0 // 底部安全非区域高度去除module间的高度, Home indicator
}
