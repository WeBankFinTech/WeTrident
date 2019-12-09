import Color from './Color'
import Size from './Size'
import Font from './Font'
import ProUI from '../../values/pro'
import PropTypes from 'prop-types'
import { PixelRatio } from 'react-native'

const ThemeConst = {
  Color,
  Size,
  Font
}
const createComponentTheme = (ThemeConst = ThemeConst) => ({
  'ThemeRect': {
    backgroundColor: ThemeConst.Color.backgroundSecondary,
    textColor: ThemeConst.Color.textLightPrimary
  },
  'Button': {
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      height: ThemeConst.Size.rowHeightM,

      paddingHorizontal: ThemeConst.Size.spaceM,

      backgroundColor: ThemeConst.Color.backgroundPrimary,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#050505'
    },
    textStyle: {
      fontSize: ThemeConst.Size.fontXL,
      color: ThemeConst.Color.textLightPrimary
    },
    activeColor: ThemeConst.Color.backgroundPrimaryDark
  },
  'List': {
    // 分割线颜色
    // lineColor: PropTypes.string,
    // // 按压态颜色
    // itemActiveColor: PropTypes.string,
    // 扩展分割线样式
    style: {
      borderColor: ThemeConst.Color.borderPrimary,
      borderWidth: 1 / PixelRatio.get()
    },
    separatorStyle: {
      backgroundColor: ThemeConst.Color.borderPrimary,
      height: 1 / PixelRatio.get(),
      marginLeft: ThemeConst.Size.spaceM
    },
    // 列表容器自定义样式
    // style: ViewPropTypes.style,
  },
  'List.Item': {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: ProUI.spaceY.medium,
      paddingHorizontal: ProUI.spaceX.large,
      minHeight: ProUI.fixedRowHeight
    },
    rightStyle: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statusStyle: {
      color: ProUI.color.sub,
      fontSize: ProUI.fontSize.medium
    },
    subStatusStyle: {
      fontSize: ProUI.fontSize.small,
      color: ProUI.color.info,
      marginTop: ProUI.spaceY.small,
      textAlign: 'right'
    },
    labelStyle: {
      color: ProUI.color.primary,
      fontSize: ProUI.fontSize.medium
    },
    iconStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: 30,
      marginRight: ProUI.spaceX.medium
    }
  },
  'List.Row': {
    normalText: {
      fontSize: ThemeConst.Size.fontM,
      color: ThemeConst.Color.textPrimary
    },
    primaryText: {
      fontSize: ThemeConst.Size.fontM,
      color: ThemeConst.Color.textPrimary
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: ProUI.fixedRowHeight,
      paddingHorizontal: ProUI.spaceX.large
    }
  },
  'Table': {
    style: {

    },
    borderStyle: {
      borderWidth: 1,
      borderColor: 'red',
      // dash
    },
    textStyle: {
      color: '',
      fontSize: '',
      fontWeight: '',
      textAlign: '',
    },
  },
  'Table.Tr': {
    style: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      // backgroundColor: ProUI.color.moduleBackground
    },
    textStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      // backgroundColor: ProUI.color.moduleBackground,
      // color: 'green',
    },
  },
  'Table.Th': {
    style: {

    },
    textStyle: {
      fontWeight: 'bold',
      color: 'red'
    }
  },
  'Table.Td': {
    style: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 15,
      paddingVertical: 13,
      backgroundColor: ProUI.color.moduleBackground
    },
    textStyle: {
    }
  },
  'Loading': {
    style: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    }
  },
  'Toast': {
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: ThemeConst.Size.radiusL,
      paddingHorizontal: ThemeConst.Size.spaceL,
      paddingTop: ThemeConst.Size.spaceM,
      paddingBottom: ThemeConst.Size.spaceM
    },
    styleWithIcon: {
      paddingTop: 16,
      paddingBottom: ProUI.spaceY.medium
    },
    textStyle: {
      color: ThemeConst.Color.textLightPrimary,
      fontSize: ThemeConst.Size.fontM,
      lineHeight: ThemeConst.Size.lineHeightM
    }
  }
})

export default {
  ThemeConst,
  createComponentTheme
}
