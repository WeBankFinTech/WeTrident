import _ from 'lodash'

export default function createTheme (baseTheme = {}, customComponentTheme = {}) {
  if (!customComponentTheme || !customComponentTheme.createComponentTheme || !customComponentTheme.ThemeConst) {
    const themeConst = baseTheme.ThemeConst
    const componentTheme = baseTheme.createComponentTheme(themeConst)
    return _.merge({}, { ThemeConst: themeConst }, componentTheme)
  }
  const mergedThemeConst = _.merge(baseTheme.ThemeConst, customComponentTheme.ThemeConst)

  const baseComponentTheme = baseTheme.createComponentTheme(mergedThemeConst)
  const customComponentThemePatch = customComponentTheme.createComponentTheme(mergedThemeConst)
  return _.merge({}, { ThemeConst: mergedThemeConst }, baseComponentTheme, customComponentThemePatch)
}
