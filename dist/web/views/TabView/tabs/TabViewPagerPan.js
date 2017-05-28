'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component,
    Button = React.Button,
    Styles = React.Styles,
    View = React.View;

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var _ = require('lodash');

var DEAD_ZONE = 12;

var DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 300,
  friction: 35
};

var TabViewPagerPan = function (_Component) {
  _inherits(TabViewPagerPan, _Component);

  function TabViewPagerPan() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TabViewPagerPan);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TabViewPagerPan.__proto__ || Object.getPrototypeOf(TabViewPagerPan)).call.apply(_ref, [this].concat(args))), _this), _this._lastValue = null, _this._isMoving = null, _this._startDirection = 0, _this._isIndexInRange = function (index) {
      var routes = _this.props.navigationState.routes;

      return index >= 0 && index <= routes.length - 1;
    }, _this._isMovingHorizontally = function (evt, gestureState) {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3) && Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 3);
    }, _this._isReverseDirection = function (gestureState) {
      if (_this._startDirection > 0) {
        return gestureState.vx < 0;
      } else {
        return gestureState.vx > 0;
      }
    }, _this._getNextIndex = function (evt, gestureState) {
      var index = _this.props.navigationState.index;


      var swipeVelocityThreshold = _this.props.swipeVelocityThreshold;
      /*
          if (Platform.OS === 'android') {
            // on Android, velocity is way lower due to timestamp being in nanosecond
            // normalize it to have the same velocity on both iOS and Android
            swipeVelocityThreshold /= 1000000;
          }
      */
      if (Math.abs(gestureState.dx) > _this.props.swipeDistanceThreshold || Math.abs(gestureState.vx) > swipeVelocityThreshold) {
        var nextIndex = index - gestureState.dx / Math.abs(gestureState.dx) * /*I18nManager.isRTL ? -1 :*/1;
        if (_this._isIndexInRange(nextIndex)) {
          return nextIndex;
        }
      }
      return index;
    }, _this._canMoveScreen = function (evt, gestureState) {
      if (_this.props.swipeEnabled === false) {
        return false;
      }
      var _this$props$navigatio = _this.props.navigationState,
          routes = _this$props$navigatio.routes,
          index = _this$props$navigatio.index;

      var canMove = _this._isMovingHorizontally(evt, gestureState) && (gestureState.dx >= DEAD_ZONE && index >= 0 || gestureState.dx <= -DEAD_ZONE && index <= routes.length - 1);
      if (canMove) {
        _this._startDirection = gestureState.dx;
      }
      return canMove;
    }, _this._startGesture = function () {
      _this._lastValue = _this.props.getLastPosition();
      _this.props.position.stopAnimation();
    }, _this._respondToGesture = function (evt, gestureState) {
      var width = _this.props.layout.width;

      var currentPosition = typeof _this._lastValue === 'number' ? _this._lastValue : _this.props.navigationState.index;
      var nextPosition = currentPosition - gestureState.dx / width * /*I18nManager.isRTL ? -1 :*/1;
      if (_this._isMoving === null) {
        _this._isMoving = _this._isMovingHorizontally(evt, gestureState);
      }
      if (_this._isMoving && _this._isIndexInRange(nextPosition)) {
        _this.props.position.setValue(nextPosition);
      }
    }, _this._finishGesture = function (evt, gestureState) {
      var currentIndex = _this.props.navigationState.index;
      var currentValue = _this.props.getLastPosition();
      if (currentValue !== currentIndex) {
        if (_this._isMoving && !_this._isReverseDirection(gestureState)) {
          var nextIndex = _this._getNextIndex(evt, gestureState);
          _this._transitionTo(nextIndex);
        } else {
          _this._transitionTo(currentIndex);
        }
      }
      _this._lastValue = null;
      _this._isMoving = null;
    }, _this._transitionTo = function (toValue) {
      var lastPosition = _this.props.getLastPosition();
      var currentTransitionProps = {
        progress: lastPosition
      };
      var nextTransitionProps = {
        progress: toValue
      };
      if (_this.props.animationEnabled !== false) {
        var transitionSpec = _this.props.configureTransition(currentTransitionProps, nextTransitionProps);

        var timing = transitionSpec.timing,
            transitionConfig = _objectWithoutProperties(transitionSpec, ['timing']);

        timing(_this.props.position, _extends({}, transitionConfig, {
          toValue: toValue
        })).start(function () {
          return _this.props.jumpToIndex(toValue);
        });
      } else {
        _this.props.position.setValue(toValue);
        _this.props.jumpToIndex(toValue);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TabViewPagerPan, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      /*
      this._panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: this._canMoveScreen,
        onMoveShouldSetPanResponderCapture: this._canMoveScreen,
        onPanResponderGrant: this._startGesture,
        onPanResponderMove: this._respondToGesture,
        onPanResponderTerminate: this._finishGesture,
        onPanResponderRelease: this._finishGesture,
        onPanResponderTerminationRequest: () => true,
      });
        */
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._resetListener = this.props.subscribe('reset', this._transitionTo);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {

      if (prevProps.navigationState.index !== this.props.navigationState.index) {
        this._transitionTo(this.props.navigationState.index);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._resetListener.remove();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          layout = _props.layout,
          position = _props.position,
          navigationState = _props.navigationState,
          children = _props.children;
      var width = layout.width;
      var routes = navigationState.routes;

      // Prepend '-1', so there are always at least 2 items in inputRange

      var inputRange = [-1].concat(_toConsumableArray(routes.map(function (x, i) {
        return i;
      })));
      var outputRange = inputRange.map(function (i) {
        return width * i * /*I18nManager.isRTL ? 1 : */-1;
      });

      var translateX = position.interpolate({
        inputRange: inputRange,
        outputRange: outputRange
      });

      var animStyle = { width: routes.length * width, transform: [{ translateX: translateX }] };
      //{...this._panResponder.panHandlers}
      return React.createElement(
        Animated.View,
        {
          style: [styles.sheet, width ? animStyle : null]

        },
        _.map(children, function (child, i) {
          return React.createElement(
            View,
            {
              key: navigationState.routes[i].key,
              testID: navigationState.routes[i].testID,
              style: width ? { width: width } : i === navigationState.index ? StyleSheet.absoluteFill : null
            },
            i === navigationState.index || width ? child : null
          );
        })
      );
    }
  }]);

  return TabViewPagerPan;
}(Component);

TabViewPagerPan.defaultProps = {
  configureTransition: function configureTransition() {
    return DefaultTransitionSpec;
  },
  initialLayout: {
    height: 0,
    width: 0
  },
  swipeDistanceThreshold: 120,
  swipeVelocityThreshold: 0.25
};


var styles = {
  sheet: Styles.createViewStyle({
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  })
};

module.exports = TabViewPagerPan;