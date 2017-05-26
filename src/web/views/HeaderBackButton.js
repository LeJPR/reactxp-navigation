
const React = require('reactxp');
const {  Button, Image,/*I18nManager,*/Component,Styles, View, Text } = React;
const {Animated} = require('reactxp-animation');





class HeaderBackButton extends Component {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: '#037aff',
    
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.x + e.width,
    });
  };

  render() {
    const {
      onPress,
      pressColorAndroid,
      width,
      title,
      tintColor,
      truncatedTitle,
    } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    const backButtonTitle = renderTruncated ? truncatedTitle : title;

    // eslint-disable-next-line global-require
    const asset = './assets/back-icon.png' /*= require('./assets/back-icon.png')*/

    return (
      <Button
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <Image
            style={[styles.icon, title && styles.iconWithTitle, { tintColor }]}
            source={asset}
          />
          {
            title &&
            <Text
              onLayout={this._onTextLayout}
              style={[styles.title, { color: tintColor }]}
              numberOfLines={1}
            >
              {backButtonTitle}
            </Text>}
        </View>
      </Button>
    );
  }
}

const styles = Styles.createViewStyle({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: 
     {
        height: 20,
        width: 12,
        marginLeft: 10,
        marginRight: 22,
        marginVertical: 12,
        resizeMode: 'contain',
        transform: [{ scaleX:/* I18nManager.isRTL ? -1 :*/ 1 }],
     },
  iconWithTitle: {
        marginRight: 5,
      }
    
});

export default HeaderBackButton;
