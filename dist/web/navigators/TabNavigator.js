'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('reactxp');
var UserInterface = React.UserInterface;

var _require = require('react-navigation'),
    TabRouter = _require.TabRouter,
    createNavigator = _require.createNavigator,
    createNavigationContainer = _require.createNavigationContainer;

var TabView = require('../views/TabView/TabView');
var TabBarTop = require('../views/TabView/TabBarTop');
var TabBarBottom = require('../views/TabView/TabBarBottom');

var TabNavigator = function TabNavigator(routeConfigs, config) {
  // Use the look native to the platform by default
  var mergedConfig = _extends({}, TabNavigator.Presets.Default, config);

  var tabBarComponent = mergedConfig.tabBarComponent,
      tabBarPosition = mergedConfig.tabBarPosition,
      tabBarOptions = mergedConfig.tabBarOptions,
      swipeEnabled = mergedConfig.swipeEnabled,
      animationEnabled = mergedConfig.animationEnabled,
      lazy = mergedConfig.lazy,
      tabsConfig = _objectWithoutProperties(mergedConfig, ['tabBarComponent', 'tabBarPosition', 'tabBarOptions', 'swipeEnabled', 'animationEnabled', 'lazy']);

  var router = TabRouter(routeConfigs, tabsConfig);

  var navigator = createNavigator(router, routeConfigs, config)(function (props) {
    return React.createElement(TabView, _extends({}, props, {
      tabBarComponent: tabBarComponent,
      tabBarPosition: tabBarPosition,
      tabBarOptions: tabBarOptions,
      swipeEnabled: swipeEnabled,
      animationEnabled: animationEnabled,
      lazy: lazy
    }));
  });

  return createNavigationContainer(navigator, tabsConfig.containerOptions);
};

var Presets = {
  iOSBottomTabs: {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: true,
    lazy: false
  },
  AndroidTopTabs: {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: false
  }
};

/**
 * Use these to get Android-style top tabs even on iOS or vice versa.
 *
 * Example:
 * ```
 * const HomeScreenTabNavigator = TabNavigator({
 *  Chat: {
 *    screen: ChatScreen,
 *  },
 *  ...
 * }, {
 *  ...TabNavigator.Presets.AndroidTopTabs,
 *  tabBarOptions: {
 *    ...
 *  },
 * });
 *```
 */
TabNavigator.Presets = {
  iOSBottomTabs: Presets.iOSBottomTabs,
  AndroidTopTabs: Presets.AndroidTopTabs,
  Default: Presets.iOSBottomTabs
};

exports.TabNavigator = TabNavigator;