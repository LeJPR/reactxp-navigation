'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Button = React.Button,
    Image = React.Image,
    Component = React.Component,
    Styles = React.Styles,
    View = React.View,
    Text = React.Text;

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var HeaderBackButton = function (_Component) {
  _inherits(HeaderBackButton, _Component);

  function HeaderBackButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HeaderBackButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HeaderBackButton.__proto__ || Object.getPrototypeOf(HeaderBackButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this._onTextLayout = function (e) {
      if (_this.state.initialTextWidth) {
        return;
      }
      _this.setState({
        initialTextWidth: e.x + e.width
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HeaderBackButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          onPress = _props.onPress,
          pressColorAndroid = _props.pressColorAndroid,
          width = _props.width,
          title = _props.title,
          tintColor = _props.tintColor,
          truncatedTitle = _props.truncatedTitle;


      var renderTruncated = this.state.initialTextWidth && width ? this.state.initialTextWidth > width : false;

      var backButtonTitle = renderTruncated ? truncatedTitle : title;

      // eslint-disable-next-line global-require
      var asset = './assets/back-icon.png'; /*= require('./assets/back-icon.png')*/

      return React.createElement(
        Button,
        {
          accessibilityComponentType: 'button',
          accessibilityLabel: backButtonTitle,
          accessibilityTraits: 'button',
          delayPressIn: 0,
          onPress: onPress,
          pressColor: pressColorAndroid,
          style: styles.container,
          borderless: true
        },
        React.createElement(
          View,
          { style: styles.container },
          React.createElement(Image, {
            style: [styles.icon, title && styles.iconWithTitle, { tintColor: tintColor }],
            source: asset
          }),
          title && React.createElement(
            Text,
            {
              onLayout: this._onTextLayout,
              style: [styles.title, { color: tintColor }],
              numberOfLines: 1
            },
            backButtonTitle
          )
        )
      );
    }
  }]);

  return HeaderBackButton;
}(Component);

HeaderBackButton.defaultProps = {
  pressColorAndroid: 'rgba(0, 0, 0, .32)',
  tintColor: '#037aff',

  truncatedTitle: 'Back'
};


var styles = Styles.createViewStyle({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 17,
    paddingRight: 10
  },
  icon: {
    height: 20,
    width: 12,
    marginLeft: 10,
    marginRight: 22,
    marginVertical: 12,
    resizeMode: 'contain',
    transform: [{ scaleX: /* I18nManager.isRTL ? -1 :*/1 }]
  },
  iconWithTitle: {
    marginRight: 5
  }

});

exports.default = HeaderBackButton;