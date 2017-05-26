

const React = require('reactxp');
const { Component} = React;
const SceneView = require ('../SceneView');
const withCachedChildNavigation = require('react-navigation/lib/withCachedChildNavigation').default;




/**
 * Component that renders the child screen of the drawer.
 */
class DrawerScreen extends Component {

  render() {
    const {
      router,
      navigation,
      childNavigationProps,
      screenProps,
    } = this.props;
    const { routes, index } = navigation.state;
    const childNavigation = childNavigationProps[routes[index].key];
    const Content = router.getComponentForRouteName(routes[index].routeName);
    return (
      <SceneView
        screenProps={screenProps}
        component={Content}
        navigation={childNavigation}
      />
    );
  }
}

module.exports = withCachedChildNavigation(DrawerScreen);
