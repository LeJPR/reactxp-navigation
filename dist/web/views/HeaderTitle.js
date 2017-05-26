'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('reactxp');
var Component = React.Component,
    Styles = React.Styles,
    View = React.View,
    Text = React.Text;

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var HeaderTitle = function HeaderTitle(_ref) {
  var style = _ref.style,
      rest = _objectWithoutProperties(_ref, ['style']);

  return React.createElement(Animated.Text, _extends({
    numberOfLines: 1
  }, rest, {
    style: [styles.title, style],
    accessibilityTraits: 'header'
  }));
};

var styles = {
  title: Styles.createTextStyle({
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: 'center',
    marginHorizontal: 16
  })
};

module.exports = HeaderTitle;