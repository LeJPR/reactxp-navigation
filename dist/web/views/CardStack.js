'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component,
    Styles = React.Styles,
    View = React.View;

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var _require2 = require('react-navigation'),
    addNavigationHelpers = _require2.addNavigationHelpers;
//import React, { Component } from 'react';

var clamp = require('clamp');

/*import {
  Animated,
  StyleSheet,
  PanResponder,
  Platform,
  View,
  I18nManager,
} from 'react-native';
*/
var Card = require('./Card');
var Header = require('./Header');
var SceneView = require('./SceneView');
var TransitionConfigs = require('./TransitionConfigs');
//import NavigationActions from '../NavigationActions';
//import addNavigationHelpers from '../addNavigationHelpers';


var emptyFunction = function emptyFunction() {};

/**
 * The duration of the card animation in milliseconds.
 */
var ANIMATION_DURATION = 200;

/**
 * The gesture distance threshold to trigger the back behavior. For instance,
 * `1 / 3` means that moving greater than 1 / 3 of the width of the screen will
 * trigger a back action
 */
var POSITION_THRESHOLD = 1 / 3;

/**
 * The threshold (in pixels) to start the gesture action.
 */
var RESPOND_THRESHOLD = 12;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
var GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 35;
var GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

var animatedSubscribeValue = function animatedSubscribeValue(animatedValue) {
  if (!animatedValue.__isNative) {
    return;
  }
  if (Object.keys(animatedValue._listeners).length === 0) {
    animatedValue.addListener(emptyFunction);
  }
};

/**
 * The ratio between the gesture velocity and the animation velocity. This allows
 * the velocity of a swipe release to carry on into the new animation.
 *
 * TODO: Understand and compute this ratio rather than using an approximation
 */
var GESTURE_ANIMATED_VELOCITY_RATIO = -4;

var CardStack = function (_Component) {
  _inherits(CardStack, _Component);

  /**
   * immediateIndex is used to represent the expected index that we will be on after a
   * transition. To achieve a smooth animation when swiping back, the action to go back
   * doesn't actually fire until the transition completes. The immediateIndex is used during
   * the transition so that gestures can be handled correctly. This is a work-around for
   * cases when the user quickly swipes back several times.
   */

  /**
   * Used to identify the starting point of the position when the gesture starts, such that it can
   * be updated according to its relative position. This means that a card can effectively be
   * "caught"- If a gesture starts while a card is animating, the card does not jump into a
   * corresponding location for the touch.
   */
  function CardStack(props) {
    _classCallCheck(this, CardStack);

    var _this = _possibleConstructorReturn(this, (CardStack.__proto__ || Object.getPrototypeOf(CardStack)).call(this, props));

    _this._gestureStartValue = 0;
    _this._isResponding = false;
    _this._immediateIndex = null;
    _this._screenDetails = {};

    _this._getScreenDetails = function (scene) {
      var _this$props = _this.props,
          screenProps = _this$props.screenProps,
          navigation = _this$props.navigation,
          router = _this$props.router;

      var screenDetails = _this._screenDetails[scene.key];
      if (!screenDetails || screenDetails.state !== scene.route) {
        var screenNavigation = addNavigationHelpers(_extends({}, navigation, {
          state: scene.route
        }));
        screenDetails = {
          state: scene.route,
          navigation: screenNavigation,
          options: router.getScreenOptions(screenNavigation, screenProps)
        };
        _this._screenDetails[scene.key] = screenDetails;
      }
      return screenDetails;
    };

    _this._renderCard = function (scene) {
      var isModal = _this.props.mode === 'modal';

      /* $FlowFixMe */

      var _TransitionConfigs$ge = TransitionConfigs.getTransitionConfig(_this.props.transitionConfig, {}, {}, isModal),
          screenInterpolator = _TransitionConfigs$ge.screenInterpolator;

      var style = screenInterpolator && screenInterpolator(_extends({}, _this.props, { scene: scene }));

      var SceneComponent = _this.props.router.getComponentForRouteName(scene.route.routeName);

      return React.createElement(
        Card,
        _extends({}, _this.props, {
          key: 'card_' + scene.key,
          style: [style, _this.props.cardStyle],
          scene: scene
        }),
        _this._renderInnerScene(SceneComponent, scene)
      );
    };

    return _this;
  }

  // tracks if a touch is currently happening


  _createClass(CardStack, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var _this2 = this;

      if (props.screenProps !== this.props.screenProps) {
        this._screenDetails = {};
      }
      props.scenes.forEach(function (newScene) {
        if (_this2._screenDetails[newScene.key] && _this2._screenDetails[newScene.key].state !== newScene.route) {
          _this2._screenDetails[newScene.key] = null;
        }
      });
    }
  }, {
    key: '_renderHeader',
    value: function _renderHeader(scene, headerMode) {
      var header = this._getScreenDetails(scene).options.header;

      if (typeof header !== 'undefined' && typeof header !== 'function') {
        return header;
      }

      var renderHeader = header || function (props) {
        return React.createElement(Header, props);
      };

      // We need to explicitly exclude `mode` since Flow doesn't see
      // mode: headerMode override below and reports prop mismatch

      var _props = this.props,
          mode = _props.mode,
          passProps = _objectWithoutProperties(_props, ['mode']);

      return renderHeader(_extends({}, passProps, {
        scene: scene,
        mode: headerMode,
        getScreenDetails: this._getScreenDetails
      }));
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: '_animatedSubscribe',
    value: function _animatedSubscribe(props) {
      // Hack to make this work with native driven animations. We add a single listener
      // so the JS value of the following animated values gets updated. We rely on
      // some Animated private APIs and not doing so would require using a bunch of
      // value listeners but we'd have to remove them to not leak and I'm not sure
      // when we'd do that with the current structure we have. `stopAnimation` callback
      // is also broken with native animated values that have no listeners so if we
      // want to remove this we have to fix this too.
      animatedSubscribeValue(props.layout.width);
      animatedSubscribeValue(props.layout.height);
      animatedSubscribeValue(props.position);
    }
  }, {
    key: '_reset',
    value: function _reset(resetToIndex, velocity) {
      Animated.timing(this.props.position, {
        toValue: resetToIndex,
        duration: ANIMATION_DURATION,
        useNativeDriver: this.props.position.__isNative,
        velocity: velocity * GESTURE_ANIMATED_VELOCITY_RATIO,
        bounciness: 0
      }).start();
    }
  }, {
    key: '_goBack',
    value: function _goBack(backFromIndex, velocity) {
      var _this3 = this;

      var _props2 = this.props,
          navigation = _props2.navigation,
          position = _props2.position,
          scenes = _props2.scenes;

      var toValue = Math.max(backFromIndex - 1, 0);

      // set temporary index for gesture handler to respect until the action is
      // dispatched at the end of the transition.
      this._immediateIndex = toValue;

      Animated.timing(position, {
        toValue: toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
        velocity: velocity * GESTURE_ANIMATED_VELOCITY_RATIO,
        bounciness: 0
      }).start(function () {
        _this3._immediateIndex = null;
        var backFromScene = scenes.find(function (s) {
          return s.index === toValue + 1;
        });
        if (!_this3._isResponding && backFromScene) {
          navigation.dispatch(NavigationActions.back({ key: backFromScene.route.key }));
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var floatingHeader = null;
      var headerMode = this._getHeaderMode();
      if (headerMode === 'float') {
        floatingHeader = this._renderHeader(this.props.scene, headerMode);
      }
      var _props3 = this.props,
          navigation = _props3.navigation,
          position = _props3.position,
          scene = _props3.scene,
          mode = _props3.mode,
          scenes = _props3.scenes;
      var index = navigation.state.index;

      var _getScreenDetails = this._getScreenDetails(scene),
          options = _getScreenDetails.options;
      /*
      const gesturesEnabled = typeof options.gesturesEnabled === 'boolean'
        ? options.gesturesEnabled
        : Platform.OS === 'ios';
        */


      var gesturesEnabled = false;

      var handlers = gesturesEnabled ? responder.panHandlers : {};

      return React.createElement(
        View,
        _extends({}, handlers, { style: styles.container }),
        React.createElement(
          Animated.View,
          { style: styles.scenes },
          scenes.map(function (s) {
            return _this4._renderCard(s);
          })
        ),
        floatingHeader
      );
    }
  }, {
    key: '_getHeaderMode',
    value: function _getHeaderMode() {
      if (this.props.headerMode) {
        return this.props.headerMode;
      }
      if ( /*Platform.OS === 'android' ||*/this.props.mode === 'modal') {
        return 'screen';
      }
      return 'float';
    }
  }, {
    key: '_renderInnerScene',
    value: function _renderInnerScene(SceneComponent, scene) {
      var _getScreenDetails2 = this._getScreenDetails(scene),
          navigation = _getScreenDetails2.navigation;

      var screenProps = this.props.screenProps;

      var headerMode = this._getHeaderMode();
      if (headerMode === 'screen') {
        return React.createElement(
          View,
          { style: styles.container },
          React.createElement(
            View,
            { style: { flex: 1 } },
            React.createElement(SceneView, {
              screenProps: screenProps,
              navigation: navigation,
              component: SceneComponent
            })
          ),
          this._renderHeader(scene, headerMode)
        );
      }
      return React.createElement(SceneView, {
        screenProps: this.props.screenProps,
        navigation: navigation,
        component: SceneComponent
      });
    }
  }]);

  return CardStack;
}(Component);

var styles = Styles.createViewStyle({
  container: {
    flex: 1,
    // Header is physically rendered after scenes so that Header won't be
    // covered by the shadows of the scenes.
    // That said, we'd have use `flexDirection: 'column-reverse'` to move
    // Header above the scenes.
    flexDirection: 'column-reverse'
  },
  scenes: {
    flex: 1
  }
});

module.exports = CardStack;