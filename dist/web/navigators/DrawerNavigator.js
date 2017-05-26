'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('reactxp');
var UserInterface = React.UserInterface;

var _require = require('react-navigation'),
    TabRouter = _require.TabRouter,
    createNavigator = _require.createNavigator,
    createNavigationContainer = _require.createNavigationContainer;

var DrawerScreen = require('../views/Drawer/DrawerScreen');
var DrawerView = require('../views/Drawer/DrawerView');
var DrawerItems = require('../views/Drawer/DrawerNavigatorItems');

var DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth: UserInterface.measureWindow().width - 64,
  contentComponent: DrawerItems,
  drawerPosition: 'left'
};

var DrawerNavigator = function DrawerNavigator(routeConfigs, config) {
  var mergedConfig = _extends({}, DefaultDrawerConfig, config);

  var containerConfig = mergedConfig.containerConfig,
      drawerWidth = mergedConfig.drawerWidth,
      contentComponent = mergedConfig.contentComponent,
      contentOptions = mergedConfig.contentOptions,
      drawerPosition = mergedConfig.drawerPosition,
      tabsConfig = _objectWithoutProperties(mergedConfig, ['containerConfig', 'drawerWidth', 'contentComponent', 'contentOptions', 'drawerPosition']);

  var contentRouter = TabRouter(routeConfigs, tabsConfig);

  var drawerRouter = TabRouter({
    DrawerClose: {
      screen: createNavigator(contentRouter, routeConfigs, config)(function (props) {
        return React.createElement(DrawerScreen, props);
      })
    },
    DrawerOpen: {
      screen: function screen() {
        return null;
      }
    }
  }, {
    initialRouteName: 'DrawerClose'
  });

  var navigator = createNavigator(drawerRouter, routeConfigs, config)(function (props) {
    return React.createElement(DrawerView, _extends({}, props, {
      drawerWidth: drawerWidth,
      contentComponent: contentComponent,
      contentOptions: contentOptions,
      drawerPosition: drawerPosition
    }));
  });

  return createNavigationContainer(navigator, containerConfig);
};

exports.DrawerNavigator = DrawerNavigator;