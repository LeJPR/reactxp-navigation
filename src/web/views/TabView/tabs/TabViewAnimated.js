
const React  = require('reactxp');
const { Component,Button,Styles,View} = React;
const {Animated} = require('reactxp-animation');
import PropTypes from 'prop-types';

let TabViewPager = require('./TabViewPagerPan');
 
class TabViewAnimated extends Component {
  

  static defaultProps = {
    renderPager: (props) => <TabViewPager {...props} />,
    initialLayout: {
      height: 0,
      width: 0,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: [this.props.navigationState.index],
      layout: {
        ...this.props.initialLayout,
        measured: false,
      },
      position: new Animated.Value(this.props.navigationState.index),
    };
  }



  componentDidMount() {
    this._mounted = true;
    this._positionListener = this.state.position.addListener(
      this._trackPosition,
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    this.state.position.removeListener(this._positionListener);
  }


  _renderScene = (props) => {
    const { renderScene, lazy } = this.props;
    const { navigationState } = props;
    const { loaded } = this.state;
    if (lazy) {
      if (loaded.includes(navigationState.routes.indexOf(props.route))) {
        return renderScene(props);
      }
      return null;
    }
    return renderScene(props);
  };

  _handleChangePosition = (value) => {
    const { onChangePosition, navigationState, lazy } = this.props;
    if (onChangePosition) {
      onChangePosition(value);
    }
    const { loaded } = this.state;
    if (lazy) {
      let next = Math.ceil(value);
      if (next === navigationState.index) {
        next = Math.floor(value);
      }
      if (loaded.includes(next)) {
        return;
      }
      this.setState({
        loaded: [...loaded, next],
      });
    }
  };

  _trackPosition = (e) => {
    this._handleChangePosition(e.value);
    this._triggerEvent('position', e.value);
    this._lastPosition = e.value;
    const { onChangePosition } = this.props;
    if (onChangePosition) {
      onChangePosition(e.value);
    }
  };

  _getLastPosition = () => {
    if (typeof this._lastPosition === 'number') {
      return this._lastPosition;
    } else {
      return this.props.navigationState.index;
    }
  };

  _handleLayout = (e) => {
    const { height, width } = e;

    if (
      this.state.layout.width === width &&
      this.state.layout.height === height
    ) {
      return;
    }

    this.setState({
      layout: {
        measured: true,
        height,
        width,
      },
    });
  };

  _buildSceneRendererProps = () => {
    return {
      layout: this.state.layout,
      navigationState: this.props.navigationState,
      position: this.state.position,
      jumpToIndex: this._jumpToIndex,
      getLastPosition: this._getLastPosition,
      subscribe: this._addSubscription,
    };
  };

  _jumpToIndex = (index) => {
    if (!this._mounted) {
      // We are no longer mounted, this is a no-op
      return;
    }

    const { canJumpToTab, navigationState } = this.props;

    if (canJumpToTab && !canJumpToTab(navigationState.routes[index])) {
      this._triggerEvent('reset', navigationState.index);
      return;
    }

    if (index !== navigationState.index) {
      this.props.onRequestChangeTab(index);
    }
  };
  _subscriptions=[];
  _addSubscription = (event, callback) => {
    if (!this._subscriptions[event]) {
      this._subscriptions[event] = [];
    }
    this._subscriptions[event].push(callback);
    return {
      remove: () => {
        const index = this._subscriptions[event].indexOf(callback);
        if (index > -1) {
          this._subscriptions[event].splice(index, 1);
        }
      },
    };
  };

  _triggerEvent = (event, value) => {
    if (this._subscriptions[event]) {
      this._subscriptions[event].forEach(fn => fn(value));
    }
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      navigationState,
      onRequestChangeTab,
      onChangePosition,
      canJumpToTab,
      lazy,
      initialLayout,
      renderScene,
      /* eslint-enable no-unused-vars */
      renderPager,
      renderHeader,
      renderFooter,
      ...rest
    } = this.props;
    const props = this._buildSceneRendererProps();

    return (
      <View
        onLayout={this._handleLayout}
        loaded={this.state.loaded}
        style={[styles.container, this.props.style]}
      >
        {renderHeader && renderHeader(props)}
        {renderPager({
          ...props,
          ...rest,
          children: navigationState.routes.map((route, index) =>
            this._renderScene({
              ...props,
              route,
              index,
              focused: index === navigationState.index,
            }),
          ),
        })}
        {renderFooter && renderFooter(props)}
      </View>
    );
  }
}

const styles = {
  container: Styles.createViewStyle({
    flex: 1,
    overflow: 'hidden',
  })
};

module.exports = TabViewAnimated;