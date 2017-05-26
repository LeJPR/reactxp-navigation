/* @flow */

const React  = require('reactxp');
const {Animated} = require('reactxp-animation');
const { Component,Button,Styles,View} = React ;


import { TabBar } from './tabs';
import TabBarIcon from './TabBarIcon';






class TabBarTop extends Component {
  static defaultProps = {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
  };



  _renderLabel = (scene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      showLabel,
      upperCaseLabel,
      labelStyle,
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
          {upperCaseLabel ? label.toUpperCase() : label}
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
      iconStyle,
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
        style={[styles.icon, iconStyle]}
      />
    );
  };

  render() {
    // TODO: Define full proptypes
    const props = this.props;

    return (
      <TabBar
        {...props}
        renderIcon={this._renderIcon}
        renderLabel={this._renderLabel}
      />
    );
  }
}

const styles = {
  icon: Styles.createViewStyle({
    height: 24,
    width: 24,
  }),
  label: Styles.createViewStyle({
    textAlign: 'center',
    fontSize: 13,
    margin: 8,
    backgroundColor: 'transparent',
  }),
};
module.exports = TabBarTop;
