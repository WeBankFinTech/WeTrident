/**
 * Created by erichua on 26/04/2017.
 */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import WeTouchable from '../../lib/WeTouchable'
import {
  ProUI,
  dimens
} from '../../values'
import ThemeableComponent from '../../theme/ThemeableComponent'
// 每个popup都有一个静态的show和hide方法，以及一个render
export default class ActionSheet extends ThemeableComponent {
  namespace = 'ActionSheet'
  themeStyleKeys = ['style', 'titleTextStyle', 'itemTextStyle']
  static _id

  static propTypes = {
    header: PropTypes.oneOfType([
      // 一般是一个字符串
      PropTypes.string,
      // 也可以传入一个Text节点
      PropTypes.element
    ]),
    items: PropTypes.arrayOf(PropTypes.shape({
      subhead: PropTypes.string,
      text: PropTypes.string,
      isWarning: PropTypes.bool,
      onItemPress: PropTypes.func
    }))
  }

  // 每个弹层决定它自身的层级、位置和动画形式
  static show (option = {}) {
    let height = 55
    height += option.header ? 33 : 0
    height += option.items ? option.items.length * 50 : 0

    let keyframes = {
      from: { translateY: height },
      to: { translateY: 0 }
    }

    Keyboard.dismiss()
    ActionSheet._id = PopupStub.addPopup(
      <ActionSheet header={option.header} items={option.items} footer={option.footer} />,
      {
        mask: true,
        zIndex: 100,
        delay: 0,
        duration: 200,
        animation: keyframes,
        easing: 'ease-in-out',
        position: 'bottom',
        wrapperStyle: { alignSelf: 'stretch', minHeight: height }
      }
    )

    return ActionSheet._id
  }

  static hide (id) {
    PopupStub.removePopup(id || ActionSheet._id)
  }

  render () {
    const {
      header,
      items,

      style,
      titleTextStyle,
      itemTextStyle
    } = this.getComponentTheme()

    return (
      <View style={style}>
        {header ? <View style={styles.header}>
          <Text style={[titleTextStyle]}>{header}</Text>
        </View> : null}
        {items.map((item, index) => (
          <WeTouchable pressMode='highlight' key={index} onPress={() => { item.onPress(item, index) }}>
            {item.subhead
              ? <View style={styles.fixedItem}>
                <Text style={[itemTextStyle, item.textStyle]}>{item.text}</Text>
                <Text style={styles.subhead}>{item.subhead}</Text>
              </View>
              : <View style={styles.item}>
                <Text style={[itemTextStyle, item.textStyle]}>{item.text}</Text>
              </View>}
          </WeTouchable>
        ))}
        <WeTouchable pressMode='highlight' onPress={() => ActionSheet.hide(ActionSheet._id)}>
          <View style={styles.footer}>
            <Text style={styles.footerItem}>取消</Text>
          </View>
        </WeTouchable>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    ...ProUI.layout.colCenter,
    backgroundColor: ProUI.color.moduleBackground,
    paddingHorizontal: ProUI.spaceX.large,
    paddingVertical: 7
  },
  warning: {
    color: ProUI.color.red
  },
  item: {
    ...ProUI.layout.colCenter,
    ...ProUI.border.top,
    backgroundColor: ProUI.color.moduleBackground,
    height: 50,
    paddingHorizontal: ProUI.spaceX.large
  },
  itemText: {
    fontSize: ProUI.fontSize.xlarge,
    color: ProUI.color.primary,
    textAlign: 'center'
  },
  fixedItem: {
    ...ProUI.border.top,
    backgroundColor: ProUI.color.moduleBackground,
    paddingVertical: ProUI.spaceY.large,
    paddingHorizontal: ProUI.spaceX.large
  },
  fixedItemText: {
    fontSize: ProUI.fontSize.xlarge,
    color: ProUI.color.primary,
    textAlign: 'center'
  },
  subhead: {
    color: ProUI.color.sub,
    fontSize: ProUI.fontSize.small,
    lineHeight: ProUI.lineHeight.small,
    textAlign: 'center'
  },
  footer: {
    ...ProUI.layout.colCenter,
    backgroundColor: ProUI.color.moduleBackground,
    height: 50,
    marginTop: 5
  },
  footerItem: {
    fontSize: ProUI.fontSize.xlarge,
    color: ProUI.color.sub,
    textAlign: 'center'
  }
})
