/* @flow */

const React = require('reactxp');
const { Component }  = React;
const propTypes = require('prop-types');



 class SceneView extends Component {
  static childContextTypes = {
    navigation: propTypes.object.isRequired,
  };

  constructor(props){
    super(props);
 
  }


  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
 
    const {
      screenProps,
      navigation,
      component: Component,
    } = this.props;


    return <Component screenProps={screenProps} navigation={navigation} />;
  }
}
module.exports = SceneView;