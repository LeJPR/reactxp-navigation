/* @flow */

const React = require('reactxp');
const{ UserInterface } = React
const {TabRouter, createNavigator,createNavigationContainer} = require('react-navigation');



const DrawerScreen = require('../views/Drawer/DrawerScreen');
const DrawerView = require('../views/Drawer/DrawerView');
const DrawerItems = require('../views/Drawer/DrawerNavigatorItems');








const DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth: UserInterface.measureWindow().width -
    (64),
  contentComponent: DrawerItems,
  drawerPosition: 'left',
};

const DrawerNavigator = (
  routeConfigs,
  config,
) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    containerConfig,
    drawerWidth,
    contentComponent,
    contentOptions,
    drawerPosition,
    ...tabsConfig
  } = mergedConfig;

  const contentRouter = TabRouter(routeConfigs, tabsConfig);

  const drawerRouter = TabRouter(
    {
      DrawerClose: {
        screen: createNavigator(
          contentRouter,
          routeConfigs,
          config,
         /* NavigatorTypes.DRAWER,*/
        )((props) => (
      <DrawerScreen {...props} />
    )),
      },
      DrawerOpen: {
        screen: () => null,
      },
    },
    {
      initialRouteName: 'DrawerClose',
    },
  );

  const navigator = createNavigator(
    drawerRouter,
    routeConfigs,
    config,
    /*NavigatorTypes.DRAWER,*/
  )((props) => (
    <DrawerView
      {...props}
      drawerWidth={drawerWidth}
      contentComponent={contentComponent}
      contentOptions={contentOptions}
      drawerPosition={drawerPosition}
    />
  ));

  return createNavigationContainer(navigator, containerConfig);
};

exports.DrawerNavigator = DrawerNavigator;
