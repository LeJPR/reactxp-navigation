'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component,
    Button = React.Button,
    Styles = React.Styles,
    View = React.View;

var TouchableItem = function (_PureComponent) {
  _inherits(TouchableItem, _PureComponent);

  function TouchableItem() {
    _classCallCheck(this, TouchableItem);

    return _possibleConstructorReturn(this, (TouchableItem.__proto__ || Object.getPrototypeOf(TouchableItem)).apply(this, arguments));
  }

  _createClass(TouchableItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          pressOpacity = _props.pressOpacity,
          pressColor = _props.pressColor,
          borderless = _props.borderless,
          rest = _objectWithoutProperties(_props, ['style', 'pressOpacity', 'pressColor', 'borderless']);

      return React.createElement(
        Button,
        _extends({}, rest, { style: style, activeOpacity: pressOpacity }),
        this.props.children
      );
    }
  }]);

  return TouchableItem;
}(PureComponent);

TouchableItem.defaultProps = {
  pressColor: 'rgba(255, 255, 255, .4)'
};


module.exports = TouchableItem;