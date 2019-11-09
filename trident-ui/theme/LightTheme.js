const ThemeConst = {
  Color: {

  },
  Size: {
    borderWidthXXS: 44,
    borderWidthXS: 44,
    borderWidthS: 44,
    borderWidthM: 44,
    borderWidthL: 44,
    borderWidthXL: 44,
    borderWidthXXL: 44,

    radiusXXS: 44,
    radiusXS: 44,
    radiusS: 44,
    radiusM: 44,
    radiusL: 44,
    radiusXL: 44,
    radiusXXL: 44,

    iconXXS: 44,
    iconXS: 44,
    iconS: 44,
    iconM: 44,
    iconL: 44,
    iconXL: 44,
    iconXXL: 44,

    rowHeightXXS: 44,
    rowHeightXS: 44,
    rowHeightS: 44,
    rowHeightM: 44,
    rowHeightL: 44,
    rowHeightXL: 44,
    rowHeightXXL: 44,

    spaceXXS: 44,
    spaceXS: 44,
    spaceS: 44,
    spaceM: 44,
    spaceL: 44,
    spaceXL: 44,
    spaceXXL: 44,

    avatarXXS: 44,
    avatarXS: 44,
    avatarS: 44,
    avatarM: 44,
    avatarL: 44,
    avatarXL: 44,
    avatarXXL: 44,
  },
  Font: {
    fontXXXXLarge: 30,
    fontXXXLarge: 24,
    fontXXLarge: 20,
    fontXLarge: 18,
    fontLarge: 16,
    fontMiddle: 13,
    fontSmall: 12,
    fontXSmall: 10,
    fontXXSmall: 8,

    fontWeightMiddle: '200',
    fontWeightLarge: '500',
  }
}
const createComponentTheme = (ThemeConst = ThemeConst) => ({
  'Button': {
    backgroundColor: '#AAA',
    textColor: '#333'
  }
})

export default {
  ThemeConst,
  createComponentTheme
}
