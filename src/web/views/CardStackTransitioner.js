/* @flow */

const React = require('reactxp');
const  { Component } = React;
//import { NativeModules } from 'react-native';

const CardStack = require('./CardStack');
const Transitioner = require('./Transitioner');
const TransitionConfigs = require('./TransitionConfigs');



const NativeAnimatedModule = false;



class CardStackTransitioner extends Component {


  static defaultProps = {
    mode: 'card',
  };

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  _configureTransition = (
    // props for the new screen
    transitionProps,
    // props for the old screen
    prevTransitionProps,
  ) => {
    const isModal = this.props.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
    const transitionSpec = {
      ...TransitionConfigs.getTransitionConfig(
        this.props.transitionConfig,
        transitionProps,
        prevTransitionProps,
        isModal,
      ).transitionSpec,
    };
   
      // Internal undocumented prop
      transitionSpec.useNativeDriver = false;
    
    return transitionSpec;
  };

  _render = (props) => {
    const {
      screenProps,
      headerMode,
      mode,
      router,
      cardStyle,
      transitionConfig,
      style,
    } = this.props;
    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        style={style}
        {...props}
      />
    );
  };
}

module.exports = CardStackTransitioner;
