const React  = require('reactxp');
const { Component,Button,Styles,View} = React;







class TouchableItem extends PureComponent {
  

  static defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
  };

  render() {
    const { style, pressOpacity, pressColor, borderless, ...rest } = this.props;

 
      return (
        <Button {...rest} style={style} activeOpacity={pressOpacity}>
          {this.props.children}
        </Button>
      );
    
  }
}

module.exports = TouchableItem;