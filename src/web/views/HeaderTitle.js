

const React = require('reactxp');
const { Component,Styles, View, Text } = React;
const {Animated} = require('reactxp-animation');



const HeaderTitle = ({ style, ...rest }) => {
  
    return(
  <Animated.Text
    numberOfLines={1}
    {...rest}
    style={[styles.title, style]}
    accessibilityTraits="header"
  />
)};

const styles = {
  title: Styles.createTextStyle({
    fontSize: 17,
    fontWeight:  '600',
    color: 'rgba(0, 0, 0, .9)',
    textAlign:  'center',
    marginHorizontal: 16,
  }),
};

module.exports = HeaderTitle;
