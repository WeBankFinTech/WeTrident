import _ from 'lodash'

export default function createTheme (baseTheme = {}, customComponentTheme = {}) {
  if (!customComponentTheme || !customComponentTheme.createComponentTheme || !customComponentTheme.ThemeConst) {
    return baseTheme
  }
  const mergedThemeConst = _.merge(baseTheme.ThemeConst, customComponentTheme.ThemeConst)

  const baseComponentTheme = baseTheme.createComponentTheme(mergedThemeConst)
  const customComponentThemePatch = customComponentTheme.createComponentTheme(mergedThemeConst)
  return _.merge({}, { ThemeConst: mergedThemeConst }, baseComponentTheme, customComponentThemePatch)
}

