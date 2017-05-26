'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Animated = React.Animated,
    Button = React.Button,
    Component = React.Component,
    Styles = React.Styles,
    View = React.View,
    UserInterface = React.UserInterface;


var MIN_SWIPE_DISTANCE = 3;
var DEVICE_WIDTH = parseFloat(UserInterface.measureWindow().width);
var THRESHOLD = DEVICE_WIDTH / 2;
var VX_MAX = 0.1;

var IDLE = 'Idle';
var DRAGGING = 'Dragging';
var SETTLING = 'Settling';

var DrawerLayout = function (_Component) {
  _inherits(DrawerLayout, _Component);

  function DrawerLayout(props, context) {
    _classCallCheck(this, DrawerLayout);

    var _this = _possibleConstructorReturn(this, (DrawerLayout.__proto__ || Object.getPrototypeOf(DrawerLayout)).call(this, props, context));

    _this._onOverlayClick = function (e) {
      e.stopPropagation();
      if (!_this._isLockedClosed() && !_this._isLockedOpen()) {
        _this.closeDrawer();
      }
    };

    _this._emitStateChanged = function (newState) {
      if (_this.props.onDrawerStateChanged) {
        _this.props.onDrawerStateChanged(newState);
      }
    };

    _this.openDrawer = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _this._emitStateChanged(SETTLING);
      Animated.parallel([Animated.timing(_this.state.openValue, {
        toValue: 1,
        easing: Animated.Easing.Default()
        // bounciness: 0,
        // restSpeedThreshold: 0.1,
        // ...options,
      }), Animated.timing(_this.state.translateValue, {
        toValue: 1,
        easing: Animated.Easing.Default()
        // bounciness: 0,
        // restSpeedThreshold: 0.1,
        // ...options,
      })]).start(function () {
        if (_this.props.onDrawerOpen) {
          _this.props.onDrawerOpen();
        }
        _this._emitStateChanged(IDLE);
      });
    };

    _this.closeDrawer = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _this._emitStateChanged(SETTLING);
      Animated.parallel([Animated.timing(_this.state.openValue, _extends({
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1
      }, options)), Animated.timing(_this.state.translateValue, _extends({
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1
      }, options))]).start(function () {
        if (_this.props.onDrawerClose) {
          _this.props.onDrawerClose();
        }
        _this._emitStateChanged(IDLE);
      });
    };

    _this._handleDrawerOpen = function () {
      if (_this.props.onDrawerOpen) {
        _this.props.onDrawerOpen();
      }
    };

    _this._handleDrawerClose = function () {
      if (_this.props.onDrawerClose) {
        _this.props.onDrawerClose();
      }
    };

    _this._isLockedClosed = function () {
      return _this.props.drawerLockMode === 'locked-closed' && !_this.state.drawerShown;
    };

    _this._isLockedOpen = function () {
      return _this.props.drawerLockMode === 'locked-open' && _this.state.drawerShown;
    };

    _this.state = {
      accessibilityViewIsModal: false,
      drawerShown: false,
      openValue: new Animated.Value(0),
      translateValue: new Animated.Value(0)
    };
    return _this;
  }

  _createClass(DrawerLayout, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var openValue = this.state.openValue;


      this._isRTL = false;

      openValue.addListener(function (_ref) {
        var value = _ref.value;

        var drawerShown = value > 0;
        var accessibilityViewIsModal = drawerShown;
        if (drawerShown !== _this2.state.drawerShown) {
          _this2.setState({ drawerShown: drawerShown, accessibilityViewIsModal: accessibilityViewIsModal });
        }

        _this2._lastOpenValue = value;
        if (_this2.props.onDrawerSlide) {
          _this2.props.onDrawerSlide({ nativeEvent: { offset: value } });
        }
      });
      /*
          this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this._shouldSetPanResponder,
            onPanResponderGrant: this._panResponderGrant,
            onPanResponderMove: this._panResponderMove,
            onPanResponderTerminationRequest: () => false,
            onPanResponderRelease: this._panResponderRelease,
            onPanResponderTerminate: () => {},
          });
          */
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          accessibilityViewIsModal = _state.accessibilityViewIsModal,
          drawerShown = _state.drawerShown,
          openValue = _state.openValue;
      var _props = this.props,
          drawerBackgroundColor = _props.drawerBackgroundColor,
          drawerPosition = _props.drawerPosition,
          drawerWidth = _props.drawerWidth;


      var dynamicDrawerStyles = {
        backgroundColor: drawerBackgroundColor,
        width: drawerWidth,
        left: drawerPosition === 'left' ? 0 : null,
        right: drawerPosition === 'right' ? 0 : null
      };

      /* Drawer styles */
      var outputRange = void 0;
      if (drawerPosition === 'left') {
        outputRange = this._isRTL ? [drawerWidth, 0] : [-drawerWidth, 0];
      } else {
        outputRange = this._isRTL ? [-drawerWidth, 0] : [drawerWidth, 0];
      }

      var drawerTranslateX = this.state.translateValue.interpolate({
        inputRange: [0, 1],
        outputRange: outputRange,
        extrapolate: 'clamp'
      });
      var animatedDrawerStyles = Styles.createAnimatedViewStyle({
        transform: [{ translateX: drawerTranslateX }]
      });

      /* Overlay styles */
      var overlayOpacity = openValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.7],
        extrapolate: 'clamp'
      });
      var animatedOverlayStyles = Styles.createAnimatedViewStyle({ opacity: overlayOpacity });
      var pointerEvents = drawerShown ? 'auto' : 'none';
      //  {...this._panResponder.panHandlers}
      return React.createElement(
        View,
        {
          style: { flex: 1, backgroundColor: 'transparent' }

        },
        React.createElement(
          Animated.View,
          { style: styles.main },
          this.props.children
        ),
        React.createElement(
          Button,
          {
            pointerEvents: pointerEvents,
            onPress: this._onOverlayClick
          },
          React.createElement(Animated.View, {
            pointerEvents: pointerEvents,
            style: [styles.overlay, animatedOverlayStyles]
          })
        ),
        React.createElement(
          Animated.View,
          {
            accessibilityViewIsModal: accessibilityViewIsModal,
            style: [styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]
          },
          this.props.renderNavigationView()
        )
      );
    }
  }, {
    key: '_getOpenValueForX',
    value: function _getOpenValueForX(x) {
      var _props2 = this.props,
          drawerPosition = _props2.drawerPosition,
          drawerWidth = _props2.drawerWidth;


      if (drawerPosition === 'left') {
        return x / drawerWidth;
      }

      // position === 'right'
      return (DEVICE_WIDTH - x) / drawerWidth;
    }
  }]);

  return DrawerLayout;
}(Component);

DrawerLayout.defaultProps = {
  drawerWidth: 0,
  drawerPosition: 'left',
  useNativeAnimations: false
};
DrawerLayout.positions = {
  Left: 'left',
  Right: 'right'
};


var styles = Styles.createAnimatedViewStyle({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1001
  },
  main: {
    flex: 1,
    zIndex: 0
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000
  }
});
module.exports = DrawerLayout;