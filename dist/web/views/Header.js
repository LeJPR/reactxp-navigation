'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var Component = React.Component,
    Styles = React.Styles,
    View = React.View,
    Text = React.Text;


var HeaderTitle = require('./HeaderTitle');
var HeaderBackButton = require('./HeaderBackButton');
//const HeaderBackButton from './HeaderBackButton';
var HeaderStyleInterpolator = require('./HeaderStyleInterpolator');

var APPBAR_HEIGHT = 44;
var STATUSBAR_HEIGHT = 0;
var TITLE_OFFSET = 40;

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Header);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Header.__proto__ || Object.getPrototypeOf(Header)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      widths: {}
    }, _this._renderTitleComponent = function (props) {
      var details = _this.props.getScreenDetails(props.scene);
      var headerTitle = details.options.headerTitle;
      if (headerTitle && typeof headerTitle !== 'string') {
        return headerTitle;
      }
      var titleString = _this._getHeaderTitleString(props.scene);

      var titleStyle = details.options.headerTitleStyle;
      var color = details.options.headerTintColor;

      // On iOS, width of left/right components depends on the calculated
      // size of the title.
      var onLayout = function onLayout(e) {
        _this.setState({
          widths: _extends({}, _this.state.widths, _defineProperty({}, props.scene.key, e.width))
        });
      };

      return React.createElement(
        HeaderTitle,
        {
          onLayout: onLayout,
          style: [color ? { color: color } : null, titleStyle]
        },
        titleString
      );
    }, _this._renderLeftComponent = function (props) {
      var options = _this.props.getScreenDetails(props.scene).options;
      if (typeof options.headerLeft !== 'undefined') {
        return options.headerLeft;
      }
      if (props.scene.index === 0) {
        return null;
      }
      var backButtonTitle = _this._getBackButtonTitleString(props.scene);
      var truncatedBackButtonTitle = _this._getTruncatedBackButtonTitle(props.scene);
      var width = _this.state.widths[props.scene.key] ? (_this.props.layout.initWidth - _this.state.widths[props.scene.key]) / 2 : undefined;

      return React.createElement(HeaderBackButton, {
        onPress: function onPress() {
          _this.props.navigation.goBack(null);
        },
        pressColorAndroid: options.headerPressColorAndroid,
        tintColor: options.headerTintColor,
        title: backButtonTitle,
        truncatedTitle: truncatedBackButtonTitle,
        width: width
      });
    }, _this._renderRightComponent = function (props) {
      var details = _this.props.getScreenDetails(props.scene);
      var headerRight = details.options.headerRight;

      return headerRight || null;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Header, [{
    key: '_getHeaderTitleString',
    value: function _getHeaderTitleString(scene) {
      var sceneOptions = this.props.getScreenDetails(scene).options;
      if (typeof sceneOptions.headerTitle === 'string') {
        return sceneOptions.headerTitle;
      }
      return sceneOptions.title;
    }
  }, {
    key: '_getLastScene',
    value: function _getLastScene(scene) {
      return this.props.scenes.find(function (s) {
        return s.index === scene.index - 1;
      });
    }
  }, {
    key: '_getBackButtonTitleString',
    value: function _getBackButtonTitleString(scene) {
      var lastScene = this._getLastScene(scene);
      if (!lastScene) {
        return null;
      }
      var headerBackTitle = this.props.getScreenDetails(lastScene).options.headerBackTitle;

      if (headerBackTitle || headerBackTitle === null) {
        return headerBackTitle;
      }
      return this._getHeaderTitleString(lastScene);
    }
  }, {
    key: '_getTruncatedBackButtonTitle',
    value: function _getTruncatedBackButtonTitle(scene) {
      var lastScene = this._getLastScene(scene);
      if (!lastScene) {
        return null;
      }
      return this.props.getScreenDetails(lastScene).options.headerTruncatedBackTitle;
    }
  }, {
    key: '_renderLeft',
    value: function _renderLeft(props) {
      return this._renderSubView(props, 'left', this._renderLeftComponent, HeaderStyleInterpolator.forLeft);
    }
  }, {
    key: '_renderTitle',
    value: function _renderTitle(props, options) {
      var style = {};

      return this._renderSubView(_extends({}, props, { style: style }), 'title', this._renderTitleComponent, HeaderStyleInterpolator.forCenter);
    }
  }, {
    key: '_renderRight',
    value: function _renderRight(props) {
      return this._renderSubView(props, 'right', this._renderRightComponent, HeaderStyleInterpolator.forRight);
    }
  }, {
    key: '_renderSubView',
    value: function _renderSubView(props, name, renderer, styleInterpolator) {
      var scene = props.scene;
      var index = scene.index,
          isStale = scene.isStale,
          key = scene.key;


      var offset = this.props.navigation.state.index - index;

      if (Math.abs(offset) > 2) {
        // Scene is far away from the active scene. Hides it to avoid unnecessary
        // rendering.
        return null;
      }

      var subView = renderer(props);

      if (subView == null) {
        return null;
      }

      var pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

      return React.createElement(
        Animated.View,
        {
          pointerEvents: pointerEvents,
          key: name + '_' + key,
          style: [{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }, styles[name], props.style | {}, styleInterpolator(_extends({}, this.props, props))]
        },
        subView
      );
    }
  }, {
    key: '_renderHeader',
    value: function _renderHeader(props) {
      var left = this._renderLeft(props);
      var right = this._renderRight(props);
      var title = this._renderTitle(props, {
        hasLeftComponent: !!left,
        hasRightComponent: !!right
      });

      return React.createElement(
        View,
        {
          style: [styles.absoluteFill, styles.header],
          key: 'scene_' + props.scene.key
        },
        title,
        left,
        right
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var appBar = void 0;

      if (this.props.mode === 'float') {
        var scenesProps = this.props.scenes.map(function (scene) {
          return {
            position: _this2.props.position,
            progress: _this2.props.progress,
            scene: scene
          };
        });
        appBar = scenesProps.map(this._renderHeader, this);
      } else {
        appBar = this._renderHeader({
          position: new Animated.Value(this.props.scene.index),
          progress: new Animated.Value(0),
          scene: this.props.scene
        });
      }

      // eslint-disable-next-line no-unused-vars

      var _props = this.props,
          scenes = _props.scenes,
          scene = _props.scene,
          position = _props.position,
          screenProps = _props.screenProps,
          progress = _props.progress,
          rest = _objectWithoutProperties(_props, ['scenes', 'scene', 'position', 'screenProps', 'progress']);

      var _props$getScreenDetai = this.props.getScreenDetails(scene, screenProps),
          options = _props$getScreenDetai.options;

      var style = options.headerStyle;

      return React.createElement(
        Animated.View,
        _extends({}, rest, { style: [styles.container, style] }),
        React.createElement(
          View,
          { style: styles.appBar },
          appBar
        )
      );
    }
  }]);

  return Header;
}(Component);

Header.HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;


var styles = Styles.createViewStyle({
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#EFEFF2',
    height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth
    },
    elevation: 4
  },
  appBar: {
    flex: 1
  },
  header: {
    flexDirection: 'row'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  title: {
    bottom: 0,
    left: TITLE_OFFSET,
    right: TITLE_OFFSET,
    top: 0,
    position: 'absolute',
    alignItems: 'center'
  },
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute'
  },
  right: {
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute'
  }
});

module.exports = Header;