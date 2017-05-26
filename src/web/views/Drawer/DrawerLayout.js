// @flow
const React = require('reactxp');
const { Animated, Button, Component, Styles, View, UserInterface } = React;



const MIN_SWIPE_DISTANCE = 3;
const DEVICE_WIDTH = parseFloat(UserInterface.measureWindow().width);
const THRESHOLD = DEVICE_WIDTH / 2;
const VX_MAX = 0.1;

const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';







class DrawerLayout extends Component {
  

  static defaultProps = {
    drawerWidth: 0,
    drawerPosition: 'left',
    useNativeAnimations: false,
  };

  static positions = {
    Left: 'left',
    Right: 'right',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      accessibilityViewIsModal: false,
      drawerShown: false,
      openValue: new Animated.Value(0),
      translateValue: new Animated.Value(0),
    };
  }

  componentWillMount() {
    const { openValue } = this.state;

    this._isRTL = false;

    openValue.addListener(({ value }) => {
      const drawerShown = value > 0;
      const accessibilityViewIsModal = drawerShown;
      if (drawerShown !== this.state.drawerShown) {
        this.setState({ drawerShown, accessibilityViewIsModal });
      }

   

      this._lastOpenValue = value;
      if (this.props.onDrawerSlide) {
        this.props.onDrawerSlide({ nativeEvent: { offset: value } });
      }
    });
/*
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: () => {},
    });
    */
  }

  render() {
    const {
      accessibilityViewIsModal,
      drawerShown,
      openValue,
    } = this.state;

    const {
      drawerBackgroundColor,
      drawerPosition,
      drawerWidth,
    } = this.props;

    const dynamicDrawerStyles = {
      backgroundColor: drawerBackgroundColor,
      width: drawerWidth,
      left: drawerPosition === 'left' ? 0 : null,
      right: drawerPosition === 'right' ? 0 : null,
    };

    /* Drawer styles */
    let outputRange;
    if (drawerPosition === 'left') {
      outputRange = this._isRTL ? [drawerWidth, 0] : [-drawerWidth, 0];
    } else {
      outputRange = this._isRTL ? [-drawerWidth, 0] : [drawerWidth, 0];
    }

    const drawerTranslateX = this.state.translateValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: 'clamp',
    });
    const animatedDrawerStyles =Styles.createAnimatedViewStyle( {
      transform: [{ translateX: drawerTranslateX }],
    });

    /* Overlay styles */
    const overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    const animatedOverlayStyles = Styles.createAnimatedViewStyle({ opacity: overlayOpacity });
    const pointerEvents = drawerShown ? 'auto' : 'none';
//  {...this._panResponder.panHandlers}
    return (
      <View
        style={{ flex: 1, backgroundColor: 'transparent' }}
      
      >
        <Animated.View style={styles.main}>
          {this.props.children}
        </Animated.View>
        <Button
          pointerEvents={pointerEvents}
          onPress={this._onOverlayClick}
        >
          <Animated.View
            pointerEvents={pointerEvents}
            style={[styles.overlay, animatedOverlayStyles]}
          />
        </Button>
        <Animated.View
          accessibilityViewIsModal={accessibilityViewIsModal}
          style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}
        >
          {this.props.renderNavigationView()}
        </Animated.View>
      </View>
    );
  }

  _onOverlayClick = (e) => {
    e.stopPropagation();
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.closeDrawer();
    }
  };

  _emitStateChanged = (newState) => {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(newState);
    }
  };

  openDrawer = (options = {}) => {
    this._emitStateChanged(SETTLING);
      Animated.parallel([
        Animated.timing(this.state.openValue, {
        toValue: 1,
        easing: Animated.Easing.Default()
       // bounciness: 0,
       // restSpeedThreshold: 0.1,
       // ...options,
      }),
       Animated.timing(this.state.translateValue, {
        toValue: 1,
        easing: Animated.Easing.Default()
       // bounciness: 0,
       // restSpeedThreshold: 0.1,
       // ...options,
      })
      ])
      .start(() => {
        if (this.props.onDrawerOpen) {
          this.props.onDrawerOpen();
        }
        this._emitStateChanged(IDLE);
      });
  };

  closeDrawer = (options= {}) => {
    this._emitStateChanged(SETTLING);
    Animated.parallel([
    Animated.timing(this.state.openValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        ...options,
      }),
       Animated.timing(this.state.translateValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        ...options,
      })
    ]).start(() => {
        if (this.props.onDrawerClose) {
          this.props.onDrawerClose();
        }
        this._emitStateChanged(IDLE);
      });
  };

  _handleDrawerOpen = () => {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  };

  _handleDrawerClose = () => {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  };

  

  

 

  _isLockedClosed = () => {
    return this.props.drawerLockMode === 'locked-closed' &&
      !this.state.drawerShown;
  };

  _isLockedOpen = () => {
    return this.props.drawerLockMode === 'locked-open' &&
      this.state.drawerShown;
  };

  _getOpenValueForX(x) {
    const { drawerPosition, drawerWidth } = this.props;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    }

    // position === 'right'
    return (DEVICE_WIDTH - x) / drawerWidth;
  }
}

const styles = Styles.createAnimatedViewStyle({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1001,
  },
  main: {
    flex: 1,
    zIndex: 0,
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
});
module.exports = DrawerLayout;