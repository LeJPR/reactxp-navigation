"use strict";

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeft(props) {
  var position = props.position,
      scene = props.scene;
  var index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index - 0.5, index, index + 0.5, index + 1],
      outputRange: [0, 0, 1, 0, 0]
    })
  };
}

function forCenter(props) {
  var opacity = props.opacity,
      position = props.position,
      scene = props.scene;
  var index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0]
    }),
    transform: [{
      translateX: position.interpolate({
        inputRange: [index - 1, index + 1],
        outputRange: [200, -200]
      })
    }]
  };
}

function forRight(props) {
  var position = props.position,
      scene = props.scene;
  var index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0]
    })
  };
}

module.exports = {
  forLeft: forLeft,
  forCenter: forCenter,
  forRight: forRight
};