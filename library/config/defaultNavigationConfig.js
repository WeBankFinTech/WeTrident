import CardStackStyleInterpolator from '@unpourtous/react-navigation/src/views/CardStack/CardStackStyleInterpolator'

export default {
  navigationOptions: {
    gesturesEnabled: true,
    headerBackTitle: null,
    headerTitleAllowFontScaling: false,
    headerStyle: {
      borderWidth: 0,
      borderBottomWidth: 0,
      elevation: 0
    },
    headerTitleStyle: {
      fontWeight: 'normal',
      textAlign: 'center'
    }
  },
  headerMode: 'screen',

  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      return CardStackStyleInterpolator.forHorizontal(sceneProps)
    }
  })
}
