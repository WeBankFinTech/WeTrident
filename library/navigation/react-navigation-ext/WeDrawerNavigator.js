import React from 'react'
import { DrawerNavigator } from '@unpourtous/react-navigation'
import SceneTraversal from '@webank/trident/library/qualityTools/SceneTraversal'

export default (routeConfigs, config) => {
  class WeDrawerNavigator extends React.Component {
    drawer = new DrawerNavigator(
      routeConfigs,
      config
    )

    render () {
      const Drawer = this.drawer
      return <Drawer {...this.props}
        ref={ref => {
          ref && (this.navigation = ref._navigation)
        }}
        onNavigationStateChange={(state, nextState, action) => {
          this.props.onNavigationStateChange && this.props.onNavigationStateChange(state, nextState, action)
          // Traversal
          if (action && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerOpen') {
            SceneTraversal.onDrawerOpen(this.navigation)
          }
        }} />
    }
  }

  return WeDrawerNavigator
}
