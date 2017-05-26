'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');
var Component = React.Component;

var propTypes = require('prop-types');

var SceneView = function (_Component) {
  _inherits(SceneView, _Component);

  function SceneView(props) {
    _classCallCheck(this, SceneView);

    return _possibleConstructorReturn(this, (SceneView.__proto__ || Object.getPrototypeOf(SceneView)).call(this, props));
  }

  _createClass(SceneView, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        navigation: this.props.navigation
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          screenProps = _props.screenProps,
          navigation = _props.navigation,
          Component = _props.component;


      return React.createElement(Component, { screenProps: screenProps, navigation: navigation });
    }
  }]);

  return SceneView;
}(Component);

SceneView.childContextTypes = {
  navigation: propTypes.object.isRequired
};

module.exports = SceneView;