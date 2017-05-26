'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component;

var SceneView = require('../SceneView');
var withCachedChildNavigation = require('react-navigation/lib/withCachedChildNavigation').default;

/**
 * Component that renders the child screen of the drawer.
 */

var DrawerScreen = function (_Component) {
  _inherits(DrawerScreen, _Component);

  function DrawerScreen() {
    _classCallCheck(this, DrawerScreen);

    return _possibleConstructorReturn(this, (DrawerScreen.__proto__ || Object.getPrototypeOf(DrawerScreen)).apply(this, arguments));
  }

  _createClass(DrawerScreen, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          router = _props.router,
          navigation = _props.navigation,
          childNavigationProps = _props.childNavigationProps,
          screenProps = _props.screenProps;
      var _navigation$state = navigation.state,
          routes = _navigation$state.routes,
          index = _navigation$state.index;

      var childNavigation = childNavigationProps[routes[index].key];
      var Content = router.getComponentForRouteName(routes[index].routeName);
      return React.createElement(SceneView, {
        screenProps: screenProps,
        component: Content,
        navigation: childNavigation
      });
    }
  }]);

  return DrawerScreen;
}(Component);

module.exports = withCachedChildNavigation(DrawerScreen);