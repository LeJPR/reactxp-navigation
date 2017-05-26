'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('reactxp');

var Component = React.Component,
    Styles = React.Styles,
    View = React.View;

var _require = require('reactxp-animation'),
    Animated = _require.Animated;

var invariant = require('fbjs/lib/invariant');

var NavigationScenesReducer = require('./ScenesReducer');
var TransitionConfigs = require('./TransitionConfigs');

var DefaultTransitionSpec = TransitionConfigs.DefaultTransitionSpec;

var Transitioner = function (_Component) {
  _inherits(Transitioner, _Component);

  function Transitioner(props, context) {
    _classCallCheck(this, Transitioner);

    // The initial layout isn't measured. Measured layout will be only available
    // when the component is mounted.
    var _this = _possibleConstructorReturn(this, (Transitioner.__proto__ || Object.getPrototypeOf(Transitioner)).call(this, props, context));

    var layout = {
      height: new Animated.Value(0),
      initHeight: 0,
      initWidth: 0,
      isMeasured: false,
      width: new Animated.Value(0)
    };

    _this.state = {
      layout: layout,
      position: new Animated.Value(_this.props.navigation.state.index),
      progress: new Animated.Value(1),
      scenes: NavigationScenesReducer([], _this.props.navigation.state)
    };

    _this._prevTransitionProps = null;
    _this._transitionProps = buildTransitionProps(props, _this.state);
    _this._isMounted = false;
    _this._isTransitionRunning = false;
    _this._queuedTransition = null;
    return _this;
  }

  _createClass(Transitioner, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._onLayout = this._onLayout.bind(this);
      this._onTransitionEnd = this._onTransitionEnd.bind(this);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextScenes = NavigationScenesReducer(this.state.scenes, nextProps.navigation.state, this.props.navigation.state);

      if (nextScenes === this.state.scenes) {
        return;
      }

      var indexHasChanged = nextProps.navigation.state.index !== this.props.navigation.state.index;
      if (this._isTransitionRunning) {
        this._queuedTransition = { nextProps: nextProps, nextScenes: nextScenes, indexHasChanged: indexHasChanged };
        return;
      }

      this._startTransition(nextProps, nextScenes, indexHasChanged);
    }
  }, {
    key: '_startTransition',
    value: function _startTransition(nextProps, nextScenes, indexHasChanged) {
      var _this2 = this;

      var nextState = _extends({}, this.state, {
        scenes: nextScenes
      });

      var position = nextState.position,
          progress = nextState.progress;


      progress.setValue(0);

      this._prevTransitionProps = this._transitionProps;
      this._transitionProps = buildTransitionProps(nextProps, nextState);

      // get the transition spec.
      var transitionUserSpec = nextProps.configureTransition ? nextProps.configureTransition(this._transitionProps, this._prevTransitionProps) : null;

      var transitionSpec = _extends({}, DefaultTransitionSpec, transitionUserSpec);

      var timing = transitionSpec.timing;

      delete transitionSpec.timing;

      var animations = indexHasChanged ? [timing(progress, _extends({}, transitionSpec, {
        toValue: 1
      })), timing(position, _extends({}, transitionSpec, {
        toValue: nextProps.navigation.state.index
      }))] : [];

      // update scenes and play the transition
      this._isTransitionRunning = true;

      this.setState(nextState, function () {
        nextProps.onTransitionStart && nextProps.onTransitionStart(_this2._transitionProps, _this2._prevTransitionProps);
        Animated.parallel(animations).start(_this2._onTransitionEnd);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = this.props.style;
      return React.createElement(
        Animated.View,
        { onLayout: this._onLayout, style: [styles.main, style] },
        this.props.render(this._transitionProps, this._prevTransitionProps)
      );
    }
  }, {
    key: '_onLayout',
    value: function _onLayout(event) {
      var height = event.height,
          width = event.width;

      if (this.state.layout.initWidth === width && this.state.layout.initHeight === height) {
        return;
      }
      var layout = _extends({}, this.state.layout, {
        initHeight: height,
        initWidth: width,
        isMeasured: true
      });

      layout.height.setValue(height);
      layout.width.setValue(width);

      var nextState = _extends({}, this.state, {
        layout: layout
      });

      this._transitionProps = buildTransitionProps(this.props, nextState);
      this.setState(nextState);
    }
  }, {
    key: '_onTransitionEnd',
    value: function _onTransitionEnd() {
      var _this3 = this;

      if (!this._isMounted) {
        return;
      }
      var prevTransitionProps = this._prevTransitionProps;
      this._prevTransitionProps = null;

      var nextState = _extends({}, this.state, {
        scenes: this.state.scenes.filter(isSceneNotStale)
      });

      this._transitionProps = buildTransitionProps(this.props, nextState);

      this.setState(nextState, function () {
        _this3.props.onTransitionEnd && _this3.props.onTransitionEnd(_this3._transitionProps, prevTransitionProps);
        if (_this3._queuedTransition) {
          _this3._startTransition(_this3._queuedTransition.nextProps, _this3._queuedTransition.nextScenes, _this3._queuedTransition.indexHasChanged);
          _this3._queuedTransition = null;
        } else {
          _this3._isTransitionRunning = false;
        }
      });
    }
  }]);

  return Transitioner;
}(Component);

function buildTransitionProps(props, state) {
  var navigation = props.navigation;
  var layout = state.layout,
      position = state.position,
      progress = state.progress,
      scenes = state.scenes;


  var scene = scenes.find(isSceneActive);

  invariant(scene, 'Could not find active scene');

  return {
    layout: layout,
    navigation: navigation,
    position: position,
    progress: progress,
    scenes: scenes,
    scene: scene,
    index: scene.index
  };
}

function isSceneNotStale(scene) {
  return !scene.isStale;
}

function isSceneActive(scene) {
  return scene.isActive;
}

var styles = Styles.createViewStyle({
  main: {
    flex: 1
  }
});

module.exports = Transitioner;