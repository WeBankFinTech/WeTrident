import Color from './Color'
import Size from './Size'
import Font from './Font'
import ProUI from '../../values/pro'
import { PixelRatio } from 'react-native'
import dimens from '../../dimens'

const ThemeConst = {
  Color,
  Size,
  Font
}
const createComponentTheme = (Theme = ThemeConst) => ({
  'Button': {
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      height: Theme.Size.rowHeightM,

      paddingHorizontal: Theme.Size.spaceM,

      backgroundColor: Theme.Color.backgroundPrimary,
      borderRadius: 5,
      borderWidth: 1 / PixelRatio.get(),
      borderColor: '#050505'
    },
    textStyle: {
      fontSize: Theme.Size.fontXL,
      color: Theme.Color.textLightPrimary
    },
    activeColor: Theme.Color.backgroundPrimaryDark
  },
  'List': {
    style: {
      borderColor: Theme.Color.borderPrimary,
      borderWidth: 1 / PixelRatio.get()
    },
    separatorStyle: {
      backgroundColor: Theme.Color.borderPrimary,
      height: 1 / PixelRatio.get(),
      marginLeft: Theme.Size.spaceM
    },
  },
  'List.Item': {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Theme.Size.spaceM,
      minHeight: Theme.Size.rowHeightM,
      borderColor: Theme.Color.borderPrimary
    },
    rightStyle: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statusStyle: {
      color: Theme.Color.textSecondary,
      fontSize: Theme.Size.fontM
    },
    subStatusStyle: {
      fontSize: Theme.Size.fontS,
      color: Theme.Color.textInfo,
      marginTop: Theme.Size.spaceS,
      textAlign: 'right'
    },
    labelStyle: {
      color: Theme.Color.textPrimary,
      fontSize: Theme.Size.fontM
    },
    iconStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: 30,
      marginRight: Theme.Size.spaceM
    }
  },
  'List.Row': {
    normalText: {
      fontSize: Theme.Size.fontM,
      color: Theme.Color.textPrimary
    },
    primaryText: {
      fontSize: Theme.Size.fontM,
      color: Theme.Color.textPrimary
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: ProUI.fixedRowHeight,
      paddingHorizontal: ProUI.spaceX.large
    }
  },
  'Checkbox': {
    style: {
      width: Theme.Size.iconS,
      height: Theme.Size.iconS,
      borderRadius: Theme.Size.iconS / 2,
      borderColor: Theme.Color.borderPrimary,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    activeStyle: {
      borderColor: Theme.Color.backgroundPrimary,
      backgroundColor: Theme.Color.backgroundPrimary
    },
    disabledStyle: {
      backgroundColor: Theme.Color.borderPrimary
    },
    iconStyle: {
      width: 10,
      height: 10,
      resizeMode: 'cover'
    }
  },
  'Table': {
    style: {},
    borderStyle: {
      borderWidth: 1 / PixelRatio.get(),
      borderColor: Theme.Color.borderPrimary,
    },
    textStyle: {
      lineHeight: ProUI.lineHeight.medium,
      fontSize: Theme.Size.fontM,
      textAlign: 'center',
      color: Theme.Color.textPrimary
    },
  },
  'Table.Tr': {
    style: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch'
    },
    textStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
    },
  },
  'Table.Th': {
    style: {
      padding: Theme.Size.spaceM
    },
    textStyle: {
      fontWeight: 'bold',
    }
  },
  'Table.Td': {
    style: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: Theme.Size.spaceM
    },
    textStyle: {}
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
      borderRadius: Theme.Size.radiusL,
      paddingHorizontal: Theme.Size.spaceL,
      paddingTop: Theme.Size.spaceM,
      paddingBottom: Theme.Size.spaceM
    },
    styleWithIcon: {
      paddingTop: 16,
      paddingBottom: ProUI.spaceY.medium
    },
    textStyle: {
      color: Theme.Color.textLightPrimary,
      fontSize: Theme.Size.fontM,
      lineHeight: Theme.Size.lineHeightM
    }
  },
  'Dialog': {
    style: {
      width: 270,
      backgroundColor: Theme.Color.backgroundNormal,
      borderRadius: ProUI.borderRadius,
      shadowColor: 'rgba(12, 2, 3, 0.6)',
      shadowRadius: 6,
      overflow: 'hidden'
    },
    titleTextStyle: {
      // color: Theme.Color.textPrimary,
      fontSize: ProUI.fontSize.xlarge,
      lineHeight: ProUI.lineHeight.xlarge,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    contentTextStyle: {
      color: Theme.Color.textPrimary,
      fontSize: ProUI.fontSize.large,
      lineHeight: ProUI.lineHeight.large,
      textAlign: 'center',
      marginTop: ProUI.spaceY.small
    },
    buttonTextStyle: {
      color: Theme.Color.backgroundPrimary,
      fontSize: ProUI.fontSize.xlarge,
      textAlign: 'center'
    },
    borderStyle: {
      borderWidth: ProUI.realOnePixel,
      borderColor: ProUI.color.border
    },
    contentStyle: {
      minHeight: 96,
      padding: 20,
      justifyContent: 'center'
    }
  },
  'ActionSheet': {
    style: {
      backgroundColor: ProUI.color.pageBackground,
      paddingBottom: dimens.PORTRAIT_UNSAFE_AREA_BOTTOM_HEIGHT
    },
    titleTextStyle: {
      lineHeight: ProUI.lineHeight.medium,
      color: Theme.Color.textPrimary,
      fontSize: Theme.Size.fontL,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    itemTextStyle: {
      color: Theme.Color.textPrimary,
      fontSize: Theme.Size.fontM,
      textAlign: 'center'
    }
  },
  'NavBar': {
    style: {
      backgroundColor: Theme.Color.backgroundPrimary,
      width: dimens.WINDOW_WIDTH,
      height: dimens.TOTAL_NAV_BAR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: dimens.STATUS_BAR_HEIGHT,
      paddingLeft: Theme.Size.spaceM,
      paddingRight: Theme.Size.spaceM
    },
    leftButtonStyle: {},
    leftButtonImageStyle: { width: 20, height: 20 },
    leftButtonTextStyle: {
      color: Theme.Color.textLightPrimary,
      fontSize: Theme.Size.fontM
    },
    titleStyle: {},
    titleTextStyle: {
      flex: 1,
      color: Theme.Color.textLightPrimary,
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontSize: 17
    },
    rightButtonStyle: {
    },
    rightButtonImageStyle: { width: 20, height: 20 },
    rightButtonTextStyle: {
      color: Theme.Color.textLightPrimary,
      fontSize: Theme.Size.fontM
    }
  }
})

export default {
  ThemeConst,
  createComponentTheme
}
