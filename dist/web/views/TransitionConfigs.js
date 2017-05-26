'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('reactxp');

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var CardStackStyleInterpolator = require('./CardStackStyleInterpolator');

// Used for all animations unless overriden
var DefaultTransitionSpec = {
  // The following options are meant to mimic the nav animations of iOS 10
  duration: 250,
  timing: Animated.spring,
  bounciness: 0,
  speed: 9
};

// Standard iOS navigation transition
var SlideFromRightIOS = {
  screenInterpolator: CardStackStyleInterpolator.forHorizontal
};

// Standard iOS navigation transition for modals
var ModalSlideFromBottomIOS = {
  screenInterpolator: CardStackStyleInterpolator.forVertical
};

// Standard Android navigation transition when opening an Activity
var FadeInFromBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
  transitionSpec: {
    duration: 350,
    // easing: Animated.Easing.Out(5), // decelerate
    timing: Animated.timing
  },
  screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid
};

// Standard Android navigation transition when closing an Activity
var FadeOutToBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
  transitionSpec: {
    duration: 230,
    // easing: Animated.Easing.In(4), // accelerate
    timing: Animated.timing
  },
  screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid
};

function defaultTransitionConfig(
// props for the new screen
transitionProps,
// props for the old screen
prevTransitionProps,
// whether we're animating in/out a modal screen
isModal) {
  /*
  if (Platform.OS === 'android') {
    // Use the default Android animation no matter if the screen is a modal.
    // Android doesn't have full-screen modals like iOS does, it has dialogs.
    if (
      prevTransitionProps && transitionProps.index < prevTransitionProps.index
    ) {
      // Navigating back to the previous screen
      return FadeOutToBottomAndroid;
    }
    return FadeInFromBottomAndroid;
  }
  */
  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(transitionConfigurer,
// props for the new screen
transitionProps,
// props for the old screen
prevTransitionProps, isModal) {
  var defaultConfig = defaultTransitionConfig(transitionProps, prevTransitionProps, isModal);
  if (transitionConfigurer) {
    return _extends({}, defaultConfig, transitionConfigurer());
  }
  return defaultConfig;
}

module.exports = {
  DefaultTransitionSpec: DefaultTransitionSpec,
  defaultTransitionConfig: defaultTransitionConfig,
  getTransitionConfig: getTransitionConfig
};