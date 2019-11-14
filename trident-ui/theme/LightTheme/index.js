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
  }
})

export default {
  ThemeConst,
  createComponentTheme
}
