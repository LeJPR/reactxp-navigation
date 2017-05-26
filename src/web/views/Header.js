
const React = require('reactxp');
const {Animated} = require('reactxp-animation');
const { Component,Styles, View, Text } = React;

const HeaderTitle = require('./HeaderTitle');
const HeaderBackButton = require('./HeaderBackButton');
//const HeaderBackButton from './HeaderBackButton';
const HeaderStyleInterpolator = require('./HeaderStyleInterpolator');

const APPBAR_HEIGHT =  44 ;
const STATUSBAR_HEIGHT =  0;
const TITLE_OFFSET =  40;

class Header extends Component {
  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;

  state = {
    widths: {},
  };

  _getHeaderTitleString(scene) {
    const sceneOptions = this.props.getScreenDetails(scene).options;
    if (typeof sceneOptions.headerTitle === 'string') {
      return sceneOptions.headerTitle;
    }
    return sceneOptions.title;
  }

  _getLastScene(scene) {
    return this.props.scenes.find((s) => s.index === scene.index - 1);
  }

  _getBackButtonTitleString(scene) {
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    const { headerBackTitle } = this.props.getScreenDetails(lastScene).options;
    if (headerBackTitle || headerBackTitle === null) {
      return headerBackTitle;
    }
    return this._getHeaderTitleString(lastScene);
  }

  _getTruncatedBackButtonTitle(scene){
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    return this.props.getScreenDetails(
      lastScene,
    ).options.headerTruncatedBackTitle;
  }

  _renderTitleComponent = (props) => {
    const details = this.props.getScreenDetails(props.scene);
    const headerTitle = details.options.headerTitle;
    if (headerTitle && typeof headerTitle !== 'string') {
      return headerTitle;
    }
    const titleString = this._getHeaderTitleString(props.scene);

    const titleStyle = details.options.headerTitleStyle;
    const color = details.options.headerTintColor;

    // On iOS, width of left/right components depends on the calculated
    // size of the title.
    const onLayout= (e) => {
          this.setState({
            widths: {
              ...this.state.widths,
              [props.scene.key]: e.width,
            },
          });
        };

    return (
      <HeaderTitle
        onLayout={onLayout}
        style={[color ? { color } : null, titleStyle]}
      >
        {titleString}
      </HeaderTitle>
    );
  };

  _renderLeftComponent = (props) => {
    const options = this.props.getScreenDetails(props.scene).options;
    if (typeof options.headerLeft !== 'undefined') {
      return options.headerLeft;
    }
    if (props.scene.index === 0) {
      return null;
    }
    const backButtonTitle = this._getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this._getTruncatedBackButtonTitle(
      props.scene,
    );
    const width = this.state.widths[props.scene.key]
      ? (this.props.layout.initWidth - this.state.widths[props.scene.key]) / 2
      : undefined;
     
    return (
      <HeaderBackButton
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        width={width}
      />
    );
  };

  _renderRightComponent = (props) => {
    const details = this.props.getScreenDetails(props.scene);
    const { headerRight } = details.options;
    return headerRight || null;
  };

  _renderLeft(props) {
    return this._renderSubView(
      props,
      'left',
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );
  }

  _renderTitle(props, options) {
    const style = {};

    

    return this._renderSubView(
      { ...props, style },
      'title',
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight(props) {
    return this._renderSubView(
      props,
      'right',
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight,
    );
  }

  _renderSubView(
    props,
    name,
    renderer,
    styleInterpolator,
  ){
    const {
      scene,
    } = props;
    const {
      index,
      isStale,
      key,
    } = scene;

    const offset = this.props.navigation.state.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const subView = renderer(props);

    if (subView == null) {
      return null;
    }

    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

    return (
      <Animated.View
        pointerEvents={pointerEvents}
        key={`${name}_${key}`}
        style={[
          {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
          styles[name],
          props.style | {},
          styleInterpolator({
            // todo: determine if we really need to splat all this.props
            ...this.props,
            ...props,
          }),
        ]}
      >
        {subView}
      </Animated.View>
    );
  }

  _renderHeader(props){
    const left = this._renderLeft(props);
    const right = this._renderRight(props);
    const title = this._renderTitle(props, {
      hasLeftComponent: !!left,
      hasRightComponent: !!right,
    });

    return (
      <View
        style={[styles.absoluteFill, styles.header]}
        key={`scene_${props.scene.key}`}
      >
        {title}
        {left}
        {right}
      </View>
    );
  }

  render() {
    let appBar;

    if (this.props.mode === 'float') {
      const scenesProps = this.props.scenes.map(
        (scene) => ({
          position: this.props.position,
          progress: this.props.progress,
          scene,
        }),
      );
      appBar = scenesProps.map(this._renderHeader, this);
    } else {
      appBar = this._renderHeader({
        position: new Animated.Value(this.props.scene.index),
        progress: new Animated.Value(0),
        scene: this.props.scene,
      });
    }

    // eslint-disable-next-line no-unused-vars
    const {
      scenes,
      scene,
      position,
      screenProps,
      progress,
      ...rest
    } = this.props;

    const { options } = this.props.getScreenDetails(scene, screenProps);
    const style = options.headerStyle;

    return (
      <Animated.View {...rest} style={[styles.container, style]}>
        <View style={styles.appBar}>
          {appBar}
        </View>
      </Animated.View>
    );
  }
}





const styles = Styles.createViewStyle({
  absoluteFill: {
        position: 'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0
    },
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#EFEFF2',
    height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  appBar: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    bottom: 0,
    left: TITLE_OFFSET,
    right: TITLE_OFFSET,
    top: 0,
    position: 'absolute',
    alignItems:'center',
  },
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
  right: {
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
});

module.exports = Header;
