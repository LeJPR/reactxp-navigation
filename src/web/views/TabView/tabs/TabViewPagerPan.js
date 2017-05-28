const React  = require('reactxp');
const { Component,Button,Styles,View} = React;
const {Animated} = require('reactxp-animation');
import PropTypes from 'prop-types';
const _ = require('lodash');

const DEAD_ZONE = 12;

const DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 300,
  friction: 35,
};

class TabViewPagerPan extends Component {
 

  static defaultProps = {
    configureTransition: () => DefaultTransitionSpec,
    initialLayout: {
      height: 0,
      width: 0,
    },
    swipeDistanceThreshold: 120,
    swipeVelocityThreshold: 0.25,
  };

  componentWillMount() {
    /*
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._canMoveScreen,
      onMoveShouldSetPanResponderCapture: this._canMoveScreen,
      onPanResponderGrant: this._startGesture,
      onPanResponderMove: this._respondToGesture,
      onPanResponderTerminate: this._finishGesture,
      onPanResponderRelease: this._finishGesture,
      onPanResponderTerminationRequest: () => true,
    });
      */
  }


  componentDidMount() {
    this._resetListener = this.props.subscribe('reset', this._transitionTo);
  }

  componentDidUpdate(prevProps) {
 
    if (prevProps.navigationState.index !== this.props.navigationState.index) {
      this._transitionTo(this.props.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

 
  _lastValue = null;
  _isMoving = null;
  _startDirection = 0;

  _isIndexInRange = (index) => {
    const { routes } = this.props.navigationState;
    return index >= 0 && index <= routes.length - 1;
  };

  _isMovingHorizontally = (evt, gestureState) => {
    return (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 3)
    );
  };

  _isReverseDirection = (gestureState) => {
    if (this._startDirection > 0) {
      return gestureState.vx < 0;
    } else {
      return gestureState.vx > 0;
    }
  };

  _getNextIndex = (evt, gestureState) => {
    const { index } = this.props.navigationState;

    let swipeVelocityThreshold = this.props.swipeVelocityThreshold;
/*
    if (Platform.OS === 'android') {
      // on Android, velocity is way lower due to timestamp being in nanosecond
      // normalize it to have the same velocity on both iOS and Android
      swipeVelocityThreshold /= 1000000;
    }
*/
    if (
      Math.abs(gestureState.dx) > this.props.swipeDistanceThreshold ||
      Math.abs(gestureState.vx) > swipeVelocityThreshold
    ) {
      const nextIndex =
        index -
        gestureState.dx /
          Math.abs(gestureState.dx) *
          (/*I18nManager.isRTL ? -1 :*/ 1);
      if (this._isIndexInRange(nextIndex)) {
        return nextIndex;
      }
    }
    return index;
  };

  _canMoveScreen = (evt, gestureState) => {
    if (this.props.swipeEnabled === false) {
      return false;
    }
    const { navigationState: { routes, index } } = this.props;
    const canMove =
      this._isMovingHorizontally(evt, gestureState) &&
      ((gestureState.dx >= DEAD_ZONE && index >= 0) ||
        (gestureState.dx <= -DEAD_ZONE && index <= routes.length - 1));
    if (canMove) {
      this._startDirection = gestureState.dx;
    }
    return canMove;
  };

  _startGesture = () => {
    this._lastValue = this.props.getLastPosition();
    this.props.position.stopAnimation();
  };

  _respondToGesture = (evt, gestureState) => {
    const { layout: { width } } = this.props;
    const currentPosition = typeof this._lastValue === 'number'
      ? this._lastValue
      : this.props.navigationState.index;
    const nextPosition =
      currentPosition - gestureState.dx / width * (/*I18nManager.isRTL ? -1 :*/ 1);
    if (this._isMoving === null) {
      this._isMoving = this._isMovingHorizontally(evt, gestureState);
    }
    if (this._isMoving && this._isIndexInRange(nextPosition)) {
      this.props.position.setValue(nextPosition);
    }
  };

  _finishGesture = (evt, gestureState) => {
    const currentIndex = this.props.navigationState.index;
    const currentValue = this.props.getLastPosition();
    if (currentValue !== currentIndex) {
      if (this._isMoving && !this._isReverseDirection(gestureState)) {
        const nextIndex = this._getNextIndex(evt, gestureState);
        this._transitionTo(nextIndex);
      } else {
        this._transitionTo(currentIndex);
      }
    }
    this._lastValue = null;
    this._isMoving = null;
  };

  _transitionTo = (toValue) => {
    const lastPosition = this.props.getLastPosition();
    const currentTransitionProps = {
      progress: lastPosition,
    };
    const nextTransitionProps = {
      progress: toValue,
    };
    if (this.props.animationEnabled !== false) {
      const transitionSpec = this.props.configureTransition(
        currentTransitionProps,
        nextTransitionProps,
      );
      const { timing, ...transitionConfig } = transitionSpec;
      timing(this.props.position, {
        ...transitionConfig,
        toValue,
      }).start(() => this.props.jumpToIndex(toValue));
    } else {
      this.props.position.setValue(toValue);
      this.props.jumpToIndex(toValue);
    }
  };

  render() {
    const { layout, position, navigationState, children } = this.props;
    const { width } = layout;
    const { routes } = navigationState;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(
      i => width * i * (/*I18nManager.isRTL ? 1 : */-1),
    );

    const translateX = position.interpolate({
      inputRange,
      outputRange,
    });

   var animStyle = {width: routes.length * width,transform: [{ translateX: translateX }]};
//{...this._panResponder.panHandlers}
    return (
      <Animated.View
        style={[
          styles.sheet,
          width
            ? animStyle
            : null,
        ]}
        
      >
        {_.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={
              width
                ? { width }
                : i === navigationState.index ? StyleSheet.absoluteFill : null
            }
          >
            {i === navigationState.index || width ? child : null}
          </View>
        ))}
      </Animated.View>
    );
  }
}

const styles = {
  sheet: Styles.createViewStyle({
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  })
};

module.exports =  TabViewPagerPan;