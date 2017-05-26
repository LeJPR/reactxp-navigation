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

var TabViewPager = require('./TabViewPagerPan');

var TabViewAnimated = function (_Component) {
  _inherits(TabViewAnimated, _Component);

  function TabViewAnimated(props) {
    _classCallCheck(this, TabViewAnimated);

    var _this = _possibleConstructorReturn(this, (TabViewAnimated.__proto__ || Object.getPrototypeOf(TabViewAnimated)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      loaded: [_this.props.navigationState.index],
      layout: _extends({}, _this.props.initialLayout, {
        measured: false
      }),
      position: new Animated.Value(_this.props.navigationState.index)
    };
    return _this;
  }

  _createClass(TabViewAnimated, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._positionListener = this.state.position.addListener(this._trackPosition);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      this.state.position.removeListener(this._positionListener);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          navigationState = _props.navigationState,
          onRequestChangeTab = _props.onRequestChangeTab,
          onChangePosition = _props.onChangePosition,
          canJumpToTab = _props.canJumpToTab,
          lazy = _props.lazy,
          initialLayout = _props.initialLayout,
          renderScene = _props.renderScene,
          renderPager = _props.renderPager,
          renderHeader = _props.renderHeader,
          renderFooter = _props.renderFooter,
          rest = _objectWithoutProperties(_props, ['navigationState', 'onRequestChangeTab', 'onChangePosition', 'canJumpToTab', 'lazy', 'initialLayout', 'renderScene', 'renderPager', 'renderHeader', 'renderFooter']);

      var props = this._buildSceneRendererProps();

      return React.createElement(
        View,
        {
          onLayout: this._handleLayout,
          loaded: this.state.loaded,
          style: [styles.container, this.props.style]
        },
        renderHeader && renderHeader(props),
        renderPager(_extends({}, props, rest, {
          children: navigationState.routes.map(function (route, index) {
            return _this2._renderScene(_extends({}, props, {
              route: route,
              index: index,
              focused: index === navigationState.index
            }));
          })
        })),
        renderFooter && renderFooter(props)
      );
    }
  }]);

  return TabViewAnimated;
}(Component);

TabViewAnimated.defaultProps = {
  renderPager: function renderPager(props) {
    return React.createElement(TabViewPager, props);
  },
  initialLayout: {
    height: 0,
    width: 0
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._renderScene = function (props) {
    var _props2 = _this3.props,
        renderScene = _props2.renderScene,
        lazy = _props2.lazy;
    var navigationState = props.navigationState;
    var loaded = _this3.state.loaded;

    if (lazy) {
      if (loaded.includes(navigationState.routes.indexOf(props.route))) {
        return renderScene(props);
      }
      return null;
    }
    return renderScene(props);
  };

  this._handleChangePosition = function (value) {
    var _props3 = _this3.props,
        onChangePosition = _props3.onChangePosition,
        navigationState = _props3.navigationState,
        lazy = _props3.lazy;

    if (onChangePosition) {
      onChangePosition(value);
    }
    var loaded = _this3.state.loaded;

    if (lazy) {
      var next = Math.ceil(value);
      if (next === navigationState.index) {
        next = Math.floor(value);
      }
      if (loaded.includes(next)) {
        return;
      }
      _this3.setState({
        loaded: [].concat(_toConsumableArray(loaded), [next])
      });
    }
  };

  this._trackPosition = function (e) {
    _this3._handleChangePosition(e.value);
    _this3._triggerEvent('position', e.value);
    _this3._lastPosition = e.value;
    var onChangePosition = _this3.props.onChangePosition;

    if (onChangePosition) {
      onChangePosition(e.value);
    }
  };

  this._getLastPosition = function () {
    if (typeof _this3._lastPosition === 'number') {
      return _this3._lastPosition;
    } else {
      return _this3.props.navigationState.index;
    }
  };

  this._handleLayout = function (e) {
    var height = e.height,
        width = e.width;


    if (_this3.state.layout.width === width && _this3.state.layout.height === height) {
      return;
    }

    _this3.setState({
      layout: {
        measured: true,
        height: height,
        width: width
      }
    });
  };

  this._buildSceneRendererProps = function () {
    return {
      layout: _this3.state.layout,
      navigationState: _this3.props.navigationState,
      position: _this3.state.position,
      jumpToIndex: _this3._jumpToIndex,
      getLastPosition: _this3._getLastPosition,
      subscribe: _this3._addSubscription
    };
  };

  this._jumpToIndex = function (index) {
    if (!_this3._mounted) {
      // We are no longer mounted, this is a no-op
      return;
    }

    var _props4 = _this3.props,
        canJumpToTab = _props4.canJumpToTab,
        navigationState = _props4.navigationState;


    if (canJumpToTab && !canJumpToTab(navigationState.routes[index])) {
      _this3._triggerEvent('reset', navigationState.index);
      return;
    }

    if (index !== navigationState.index) {
      _this3.props.onRequestChangeTab(index);
    }
  };

  this._subscriptions = [];

  this._addSubscription = function (event, callback) {
    if (!_this3._subscriptions[event]) {
      _this3._subscriptions[event] = [];
    }
    _this3._subscriptions[event].push(callback);
    return {
      remove: function remove() {
        var index = _this3._subscriptions[event].indexOf(callback);
        if (index > -1) {
          _this3._subscriptions[event].splice(index, 1);
        }
      }
    };
  };

  this._triggerEvent = function (event, value) {
    if (_this3._subscriptions[event]) {
      _this3._subscriptions[event].forEach(function (fn) {
        return fn(value);
      });
    }
  };
};

var styles = {
  container: Styles.createViewStyle({
    flex: 1,
    overflow: 'hidden'
  })
};

module.exports = TabViewAnimated;