/* eslint-disable */
import React from 'react';
import {
  createNavigator,
  createNavigationContainer,
  CardStackTransitioner,
  NavigationActions
} from '@unpourtous/react-navigation'
import DyStackRouter from './DyStackRouter';

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props

export default (routeConfigMap, stackConfig = {}) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    headerMode,
    headerTransitionPreset,
    mode,
    cardStyle,
    transitionConfig,
    onTransitionStart,
    onTransitionEnd,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = DyStackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with CardStackTransitioner as the view
  const navigator = createNavigator(router)(
    props => (
      <CardStackTransitioner
        {...props}
        headerMode={headerMode}
        headerTransitionPreset={headerTransitionPreset}
        mode={mode}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        onTransitionStart={onTransitionStart}
        onTransitionEnd={(lastTransition, transition) => {
          const { state, dispatch } = props.navigation;
          dispatch(NavigationActions.completeTransition({ key: state.key }));
          onTransitionEnd && onTransitionEnd();
        }}
      />
    )
  );

  return createNavigationContainer(navigator);
};
