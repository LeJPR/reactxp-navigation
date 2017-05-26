'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component;
//import { NativeModules } from 'react-native';

var CardStack = require('./CardStack');
var Transitioner = require('./Transitioner');
var TransitionConfigs = require('./TransitionConfigs');

var NativeAnimatedModule = false;

var CardStackTransitioner = function (_Component) {
  _inherits(CardStackTransitioner, _Component);

  function CardStackTransitioner() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CardStackTransitioner);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CardStackTransitioner.__proto__ || Object.getPrototypeOf(CardStackTransitioner)).call.apply(_ref, [this].concat(args))), _this), _this._configureTransition = function (
    // props for the new screen
    transitionProps,
    // props for the old screen
    prevTransitionProps) {
      var isModal = _this.props.mode === 'modal';
      // Copy the object so we can assign useNativeDriver below
      // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
      var transitionSpec = _extends({}, TransitionConfigs.getTransitionConfig(_this.props.transitionConfig, transitionProps, prevTransitionProps, isModal).transitionSpec);

      // Internal undocumented prop
      transitionSpec.useNativeDriver = false;

      return transitionSpec;
    }, _this._render = function (props) {
      var _this$props = _this.props,
          screenProps = _this$props.screenProps,
          headerMode = _this$props.headerMode,
          mode = _this$props.mode,
          router = _this$props.router,
          cardStyle = _this$props.cardStyle,
          transitionConfig = _this$props.transitionConfig,
          style = _this$props.style;

      return React.createElement(CardStack, _extends({
        screenProps: screenProps,
        headerMode: headerMode,
        mode: mode,
        router: router,
        cardStyle: cardStyle,
        transitionConfig: transitionConfig,
        style: style
      }, props));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CardStackTransitioner, [{
    key: 'render',
    value: function render() {
      return React.createElement(Transitioner, {
        configureTransition: this._configureTransition,
        navigation: this.props.navigation,
        render: this._render,
        style: this.props.style,
        onTransitionStart: this.props.onTransitionStart,
        onTransitionEnd: this.props.onTransitionEnd
      });
    }
  }]);

  return CardStackTransitioner;
}(Component);

CardStackTransitioner.defaultProps = {
  mode: 'card'
};


module.exports = CardStackTransitioner;