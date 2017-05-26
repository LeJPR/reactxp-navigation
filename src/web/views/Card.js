/* @flow */



const React  = require('reactxp');
const {Animated} = require('reactxp-animation');
const { Component,Styles} = React ;
//import createPointerEventsContainer from './PointerEventsContainer';


/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class Card extends Component {


  render() {
    const {
      children,
      pointerEvents,
      style,
    } = this.props;
    return (
      <Animated.View
        //pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, style]}
      >
        {children}
      </Animated.View>
    );
  }
}

let styles = Styles.createViewStyle({
  main: {
    backgroundColor: '#E9E9EF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    top: 0,
  },
});

//Card = createPointerEventsContainer(Card);

module.exports =Card;
