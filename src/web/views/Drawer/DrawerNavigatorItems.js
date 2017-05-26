
const React = require('reactxp');
const { View, Button, Text, Styles } = React;

//import TouchableItem from '../TouchableItem';





/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = (
  {
    navigation,
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    getLabel,
    renderIcon,
    style,
    labelStyle,
  },
) => (
  <View style={[styles.container, style]}>
    {navigation.state.routes.map((route, index) => {
      const focused = navigation.state.index === index;
      const color = focused ? activeTintColor : inactiveTintColor;
      const backgroundColor = focused
        ? activeBackgroundColor
        : inactiveBackgroundColor;
      const scene = { route, index, focused, tintColor: color };
      const icon = renderIcon(scene);
      const label = getLabel(scene);
      return (
        <Button
          key={route.key}
          onPress={() => {
            navigation.navigate('DrawerClose');
            navigation.navigate(route.routeName);
          }}
          delayPressIn={0}
        >
          <View style={[styles.item, { backgroundColor }]}>
            {icon
              ? <View
                  style={[styles.icon, focused ? null : styles.inactiveIcon]}
                >
                  {icon}
                </View>
              : null}
            {typeof label === 'string'
              ? <Text style={[styles.label, { color }, labelStyle]}>
                  {label}
                </Text>
              : label}
          </View>
        </Button>
      );
    })}
  </View>
);

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};

const styles = Styles.createViewStyle({
  container: {
    marginTop:  0,
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});

module.exports = DrawerNavigatorItems;
