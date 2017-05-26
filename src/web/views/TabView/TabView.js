/* @flow */

const React  = require('reactxp');
const {Animated} = require('reactxp-animation');
const { Component,Button,Styles} = React ;
const SceneView = require('../SceneView');
const withCachedChildNavigation = require('react-navigation/lib/withCachedChildNavigation').default;

import { TabViewAnimated, TabViewPagerPan } from './tabs';




class TabView extends Component {


  _handlePageChanged = (index) => {
    const { navigation } = this.props;
    navigation.navigate(navigation.state.routes[index].routeName);
  };

  _renderScene = ({ route }) => {
    const { screenProps } = this.props;
    const childNavigation = this.props.childNavigationProps[route.key];
    const TabComponent = this.props.router.getComponentForRouteName(
      route.routeName,
    );
    return (
      <SceneView
        screenProps={screenProps}
        component={TabComponent}
        navigation={childNavigation}
      />
    );
  };

  _getLabel = ({ route, tintColor, focused }) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {},
    );

    if (options.tabBarLabel) {
      return typeof options.tabBarLabel === 'function'
        ? options.tabBarLabel({ tintColor, focused })
        : options.tabBarLabel;
    }

    if (typeof options.title === 'string') {
      return options.title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, route, tintColor }) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {},
    );
    if (options.tabBarIcon) {
      return typeof options.tabBarIcon === 'function'
        ? options.tabBarIcon({ tintColor, focused })
        : options.tabBarIcon;
    }
    return null;
  };

  _renderTabBar = (props) => {
    const {
      tabBarOptions,
      tabBarComponent: TabBarComponent,
      animationEnabled,
    } = this.props;
    if (typeof TabBarComponent === 'undefined') {
      return null;
    }
    return (
      <TabBarComponent
        {...props}
        {...tabBarOptions}
        navigation={this.props.navigation}
        getLabel={this._getLabel}
        renderIcon={this._renderIcon}
        animationEnabled={animationEnabled}
      />
    );
  };

  _renderPager = (props) => <TabViewPagerPan {...props} />;

  render() {
    const {
      router,
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      swipeEnabled,
      lazy,
      screenProps,
    } = this.props;

    let renderHeader;
    let renderFooter;
    let renderPager;

    const { state } = this.props.navigation;
    const options = router.getScreenOptions(
      this.props.childNavigationProps[state.routes[state.index].key],
      screenProps || {},
    );

    const tabBarVisible = options.tabBarVisible == null
      ? true
      : options.tabBarVisible;

    if (tabBarComponent !== undefined && tabBarVisible) {
      if (tabBarPosition === 'bottom') {
        renderFooter = this._renderTabBar;
      } else {
        renderHeader = this._renderTabBar;
      }
    }

    if (animationEnabled === false && swipeEnabled === false) {
      renderPager = this._renderPager;
    }

    const props = {
      lazy,
      animationEnabled,
      swipeEnabled,
      renderPager,
      renderHeader,
      renderFooter,
      renderScene: this._renderScene,
      onRequestChangeTab: this._handlePageChanged,
      navigationState: this.props.navigation.state,
      screenProps: this.props.screenProps,
      style: styles.container,
    };

    return <TabViewAnimated {...props} />;
  }
}

const TabViewEnhanced = withCachedChildNavigation(TabView);

module.exports = TabViewEnhanced;

const styles ={
  container: Styles.createViewStyle({
    flex: 1,
  }),
};
