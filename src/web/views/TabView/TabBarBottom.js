

const React  = require('reactxp');
const {Animated} = require('reactxp-animation');
const { Component,Button,Styles,View} = React ;
const TabBarIcon = require('./TabBarIcon');



class TabBarBottom extends Component {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
  };

 

  _renderLabel = (scene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(
      (inputIndex) =>
        inputIndex === index ? activeTintColor : inactiveTintColor,
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });

    const label = this.props.getLabel(scene);
    if (typeof label === 'string') {
      return (
        <Animated.Text style={[styles.label, { color }, labelStyle]}>
          {label}
        </Animated.Text>
      );
    }
    if (typeof label === 'function') {
      return label(scene);
    }

    return label;
  };

  _renderIcon = (scene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  };

  render() {
    const {
      position,
      navigation,
      jumpToIndex,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
    } = this.props;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    return (
      <View style={[styles.tabBar, style]}>
        {routes.map((route, index) => {
          const focused = index === navigation.state.index;
          const scene = { route, index, focused };
          const outputRange = inputRange.map(
            (inputIndex) =>
              inputIndex === index
                ? activeBackgroundColor
                : inactiveBackgroundColor,
          );
          const backgroundColor = position.interpolate({
            inputRange,
            outputRange,
          });
          const justifyContent = this.props.showIcon ? 'flex-end' : 'center';
          return (
            <Button
              key={route.key}
              onPress={() => jumpToIndex(index)}
              style={{flex:1}}
            >
              <Animated.View
                style={[styles.tab, { backgroundColor, justifyContent }]}
              >
                {this._renderIcon(scene)}
                {this._renderLabel(scene)}
              </Animated.View>
            </Button>
          );
        })}
      </View>
    );
  }
}

const styles = {
  tabBar: Styles.createViewStyle({
    height: 49, // Default tab bar height in iOS 10
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
    backgroundColor: '#f4f4f4', // Default background color in iOS 10
  }),
  tab: Styles.createViewStyle({
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  }),
  icon: Styles.createViewStyle({
    flexGrow: 1,
  }),
  label: Styles.createViewStyle({
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  }),
};
module.exports = TabBarBottom;