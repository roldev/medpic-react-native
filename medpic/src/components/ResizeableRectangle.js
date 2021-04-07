import React, {useState, useEffect, useRef} from 'react';
import {Animated, PanResponder} from 'react-native';
import { act } from 'react-test-renderer';

import config from '../config';

const TOP_LEFT = 'TOP_LEFT';
const TOP_RIGHT = 'TOP_RIGHT';
const BOTTOM_LEFT = 'BOTTOM_LEFT';
const BOTTOM_RIGHT = 'BOTTOM_RIGHT';

const FRAME_POINT_SHORT_SIDE = 50;
const FRAME_POINT_LONG_SIDE = 50;
const FRAME_POINT_BORDER_WIDTH = 2;

export default function ResizableRectangle({rect, setRect, externalStyle}) {
  const [originalRect, setOriginalRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [hasChangedRect, setHasChangedRect] = useState(false);
  const [actualRect, setActualRect] = useState({
    topLeft: {
      x: 0,
      y: 0,
    },
    topRight: {
      x: 0,
      y: 0,
    },
    bottomLeft: {
      x: 0,
      y: 0,
    },
    bottomRight: {
      x: 0,
      y: 0,
    },
  });

  const buildCorner = (cornerName) => {
    const elementRef = useRef(null);
    const point = useRef(new Animated.ValueXY()).current;
    const responder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (event, gestureState) => {
          point.setOffset({
            x: point.x._value,
            y: point.y._value,
          });
          point.setValue({x: 0, y: 0});
        },
        onMoveShouldSetPanResponder: () => {
          point.setOffset({
            x: point.x._value,
            y: point.y_value,
          });
        },
        onPanResponderMove: (event, gestureState) => {
          Animated.event([null, {dx: point.x, dy: point.y}], {
            useNativeDriver: false,
          })(event, gestureState);
        },
        onPanResponderRelease: () => {
          point.flattenOffset();
          snapToPoint(cornerName);
        },
      }),
    ).current;

    return [point, responder, elementRef];
  };

  const [topLeft, topLeftResponder, topLeftElementRef] = buildCorner(TOP_LEFT);
  const [topRight, topRightResponder, topRightElementRef] = buildCorner(
    TOP_RIGHT,
  );
  const [bottomLeft, bottomLeftResponder, bottomLeftElementRef] = buildCorner(
    BOTTOM_LEFT,
  );
  const [
    bottomRight,
    bottomRightResponder,
    bottomRightElementRef,
  ] = buildCorner(BOTTOM_RIGHT);

  useEffect(() => {
    if((Object.keys(rect).length > 0) && originalRect.width == 0) {
      setOriginalRect(rect);
    }
  }, [JSON.stringify(rect)]);

  useEffect(() => {
    if (hasChangedRect) {
      topLeftElementRef.current.measure((x, y, width, height, pageX, pageY) => {
        setActualRect({
          ...actualRect,
          topLeft: {
            x: pageX,
            y: pageY,
          },
        });
      });

      topRightElementRef.current.measure((x, y, width, height, pageX, pageY) => {
        setActualRect({
          ...actualRect,
          topRight: {
            x: pageX,
            y: pageY,
          },
        });
      });
      
      bottomLeftElementRef.current.measure((x, y, width, height, pageX, pageY) => {
        setActualRect({
          ...actualRect,
          bottomLeft: {
            x: pageX,
            y: pageY,
          },
        });
      });

      bottomRightElementRef.current.measure((x, y, width, height, pageX, pageY) => {
        setActualRect({
          ...actualRect,
          bottomRight: {
            x: pageX,
            y: pageY,
          },
        });
      });
    }

    setHasChangedRect(false);
  }, [hasChangedRect]);

  useEffect(() => {
    setRect({
      x: actualRect.topLeft.x,
      y: actualRect.topLeft.y,
      width: actualRect.topRight.x - actualRect.topLeft.x,
      height: actualRect.bottomLeft.y - actualRect.topLeft.y,
    });
  }, [JSON.stringify(actualRect)]);

  const snapToPoint = (leadingPoint) => {
    switch (leadingPoint) {
      case TOP_LEFT:
        topRight.y.setValue(topLeft.y._value);
        bottomLeft.x.setValue(topLeft.x._value);
        break;
      case TOP_RIGHT:
        topLeft.y.setValue(topRight.y._value);
        bottomRight.x.setValue(topRight.x._value);
        break;
      case BOTTOM_LEFT:
        topLeft.x.setValue(bottomLeft.x._value);
        bottomRight.y.setValue(bottomLeft.y._value);
        break;
      case BOTTOM_RIGHT:
        topRight.x.setValue(bottomRight.x._value);
        bottomLeft.y.setValue(bottomRight.y._value);
        break;
      default:
        console.warn(`unknown leadingPoint to snap <${leadingPoint}>`);
        break;
    }

    setHasChangedRect(true);
  };

  const styles = styleBuilder({rect: originalRect});

  return (
    <>
      <Animated.View
        ref={topLeftElementRef}
        style={[
          styles.topLeftPicker,
          {
            transform: [
              {
                translateX: topLeft.x.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 100],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: topLeft.y.interpolate({
                  inputRange: [0, 250],
                  outputRange: [0, 250],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...topLeftResponder.panHandlers}
      />
      <Animated.View
        ref={topRightElementRef}
        style={[
          styles.topRightPicker,
          {
            transform: [
              {
                translateX: topRight.x.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [-100, 0],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: topRight.y.interpolate({
                  inputRange: [0, 250],
                  outputRange: [0, 250],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...topRightResponder.panHandlers}
      />
      <Animated.View
        ref={bottomLeftElementRef}
        style={[
          styles.bottomLeftPicker,
          {
            transform: [
              {
                translateX: bottomLeft.x.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 100],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: bottomLeft.y.interpolate({
                  inputRange: [-250, 0],
                  outputRange: [-250, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...bottomLeftResponder.panHandlers}
      />
      <Animated.View
        ref={bottomRightElementRef}
        style={[
          styles.bottomRightPicker,
          {
            transform: [
              {
                translateX: bottomRight.x.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [-100, 0],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: bottomRight.y.interpolate({
                  inputRange: [-250, 0],
                  outputRange: [-250, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...bottomRightResponder.panHandlers}
      />
    </>
  );
}

function styleBuilder({rect}) {
  return {
    screenWrapper: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },

    box: {
      backgroundColor: 'transparent',
      borderColor: config.colors.primary,
      borderWidth: 3,
      borderRadius: 5,
      position: 'absolute',
      top: rect?.y || 50,
      left: rect?.x || 50,
      width: rect?.width || 100,
      height: rect?.height || 100,
    },

    topLeftPicker: {
      position: 'absolute',
      top: rect?.y || 50 - 25,
      left: rect?.x != undefined ? rect.x + 25 : 0,
      borderColor: config.colors.primary,
      borderLeftWidth: FRAME_POINT_BORDER_WIDTH,
      borderTopWidth: FRAME_POINT_BORDER_WIDTH,
      width: FRAME_POINT_SHORT_SIDE,
      height: FRAME_POINT_LONG_SIDE,
    },

    topRightPicker: {
      position: 'absolute',
      top: rect?.y || 50 - 25,
      left: rect?.x != undefined ? rect.x + rect.width + 25 : 0,
      borderColor: config.colors.primary,
      borderRightWidth: FRAME_POINT_BORDER_WIDTH,
      borderTopWidth: FRAME_POINT_BORDER_WIDTH,
      width: FRAME_POINT_SHORT_SIDE,
      height: FRAME_POINT_LONG_SIDE,
    },

    bottomLeftPicker: {
      position: 'absolute',
      top: rect?.y != undefined ? rect.y + rect.height + 25 : 0,
      left: rect?.x || 25,
      borderColor: config.colors.primary,
      borderLeftWidth: FRAME_POINT_BORDER_WIDTH,
      borderBottomWidth: FRAME_POINT_BORDER_WIDTH,
      width: FRAME_POINT_SHORT_SIDE,
      height: FRAME_POINT_LONG_SIDE,
    },

    bottomRightPicker: {
      position: 'absolute',
      top: rect?.y != undefined ? rect.y + rect.height + 25 : 0,
      left: rect?.x != undefined ? rect.x + rect.width + 25 : 0,
      borderColor: config.colors.primary,
      borderRightWidth: FRAME_POINT_BORDER_WIDTH,
      borderBottomWidth: FRAME_POINT_BORDER_WIDTH,
      width: FRAME_POINT_SHORT_SIDE,
      height: FRAME_POINT_LONG_SIDE,
    },
  };
}
