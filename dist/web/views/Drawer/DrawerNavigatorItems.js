'use strict';

var React = require('reactxp');
var View = React.View,
    Button = React.Button,
    Text = React.Text,
    Styles = React.Styles;

//import TouchableItem from '../TouchableItem';


/**
 * Component that renders the navigation list in the drawer.
 */

var DrawerNavigatorItems = function DrawerNavigatorItems(_ref) {
  var navigation = _ref.navigation,
      activeTintColor = _ref.activeTintColor,
      activeBackgroundColor = _ref.activeBackgroundColor,
      inactiveTintColor = _ref.inactiveTintColor,
      inactiveBackgroundColor = _ref.inactiveBackgroundColor,
      getLabel = _ref.getLabel,
      renderIcon = _ref.renderIcon,
      style = _ref.style,
      labelStyle = _ref.labelStyle;
  return React.createElement(
    View,
    { style: [styles.container, style] },
    navigation.state.routes.map(function (route, index) {
      var focused = navigation.state.index === index;
      var color = focused ? activeTintColor : inactiveTintColor;
      var backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
      var scene = { route: route, index: index, focused: focused, tintColor: color };
      var icon = renderIcon(scene);
      var label = getLabel(scene);
      return React.createElement(
        Button,
        {
          key: route.key,
          onPress: function onPress() {
            navigation.navigate('DrawerClose');
            navigation.navigate(route.routeName);
          },
          delayPressIn: 0
        },
        React.createElement(
          View,
          { style: [styles.item, { backgroundColor: backgroundColor }] },
          icon ? React.createElement(
            View,
            {
              style: [styles.icon, focused ? null : styles.inactiveIcon]
            },
            icon
          ) : null,
          typeof label === 'string' ? React.createElement(
            Text,
            { style: [styles.label, { color: color }, labelStyle] },
            label
          ) : label
        )
      );
    })
  );
};

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent'
};

var styles = Styles.createViewStyle({
  container: {
    marginTop: 0,
    paddingVertical: 4
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center'
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62
  },
  label: {
    margin: 16,
    fontWeight: 'bold'
  }
});

module.exports = DrawerNavigatorItems;