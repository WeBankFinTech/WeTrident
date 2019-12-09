import Color from './Color'
import Size from './Size'
import Font from './Font'
const ThemeConst = {
  Color,
  Size,
  Font
}
const createComponentTheme = (ThemeConst = ThemeConst) => ({
  'ThemeRect': {
    backgroundColor: ThemeConst.Color.backgroundSecondary,
    textColor: ThemeConst.Color.textPrimary
  },
  'Button': {
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      height: ThemeConst.Size.rowHeightM,

      paddingHorizontal: ThemeConst.Size.spaceM,

      backgroundColor: ThemeConst.Color.backgroundPrimary,
      borderRadius: 10
    },
    textStyle: {
      fontSize: ThemeConst.Size.fontXL,
      color: ThemeConst.Color.textPrimary
    },
    activeColor: ThemeConst.Color.backgroundPrimaryDark
  }
})

export default {
  ThemeConst,
  createComponentTheme
}
