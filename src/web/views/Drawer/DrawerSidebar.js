

const React = require('reactxp');
const { Component, Styles, View} = React;
const withCachedChildNavigation = require('react-navigation/lib/withCachedChildNavigation').default;



/**
 * Component that renders the sidebar screen of the drawer.
 */
class DrawerSidebar extends Component {


  _getScreenOptions = (routeKey) => {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      'DrawerClose',
    );
    return DrawerScreen.router.getScreenOptions(
      this.props.childNavigationProps[routeKey],
      this.props.screenProps,
    );
  };

  _getLabel = ({ focused, tintColor, route }) => {
    const { drawerLabel, title } = this._getScreenOptions(route.key);
    if (drawerLabel) {
      return typeof drawerLabel === 'function'
        ? drawerLabel({ tintColor, focused })
        : drawerLabel;
    }

    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, tintColor, route }) => {
    const { drawerIcon } = this._getScreenOptions(route.key);
    if (drawerIcon) {
      return typeof drawerIcon === 'function'
        ? drawerIcon({ tintColor, focused })
        : drawerIcon;
    }
    return null;
  };

  render() {
    const ContentComponent = this.props.contentComponent;
    return (
      <View style={[styles.container, this.props.style]}>
        <ContentComponent
          {...this.props.contentOptions}
          navigation={this.props.navigation}
          getLabel={this._getLabel}
          renderIcon={this._renderIcon}
          router={this.props.router}
        />
      </View>
    );
  }
}
module.exports = withCachedChildNavigation(DrawerSidebar);

const styles = Styles.createViewStyle({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
