'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('react-navigation'),
    StackRouter = _require.StackRouter,
    createNavigator = _require.createNavigator,
    createNavigationContainer = _require.createNavigationContainer;

var CardStack = require('../views/CardStack');
var CardStackTransitioner = require('../views/CardStackTransitioner');
var React = require('reactxp');

var StackNavigator = function StackNavigator(routeConfigMap) {
  var stackConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var initialRouteName = stackConfig.initialRouteName,
      initialRouteParams = stackConfig.initialRouteParams,
      paths = stackConfig.paths,
      headerMode = stackConfig.headerMode,
      mode = stackConfig.mode,
      cardStyle = stackConfig.cardStyle,
      transitionConfig = stackConfig.transitionConfig,
      onTransitionStart = stackConfig.onTransitionStart,
      onTransitionEnd = stackConfig.onTransitionEnd,
      navigationOptions = stackConfig.navigationOptions;

  var stackRouterConfig = {
    initialRouteName: initialRouteName,
    initialRouteParams: initialRouteParams,
    paths: paths,
    navigationOptions: navigationOptions
  };
  var router = StackRouter(routeConfigMap, stackRouterConfig);
  var navigator = createNavigator(router, routeConfigMap, stackConfig)(function (props) {

    return React.createElement(CardStackTransitioner, _extends({}, props, {
      headerMode: headerMode,
      mode: mode,
      cardStyle: cardStyle,
      transitionConfig: transitionConfig,
      onTransitionStart: onTransitionStart,
      onTransitionEnd: onTransitionEnd
    }));
  });

  return createNavigationContainer(navigator, stackConfig.containerOptions);
};

exports.StackNavigator = StackNavigator;