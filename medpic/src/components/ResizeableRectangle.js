import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  PanResponder
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import config from '../config';

export default function ResizableRectangle({rect, setRect, externalStyle}) {
  const resizeableRectRef = useRef(null);

  const [restrictingBox, setRestrinctingBox] = useState({
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: 100
  });

  // pan
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event, gestureState) => {
        pan.setOffset({x: pan.x._value, y: pan.y._value});
        pan.setValue({x: 0, y: 0});
      },
      onMoveShouldSetPanResponder: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y_value
        });
      },
      onPanResponderMove: (event, gestureState) => {
        Animated.event([null, {dx: pan.x, dy: pan.y}])(event, gestureState);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  useEffect(() => {
    if ((Object.keys(rect).length > 0)) {
      calcRestrictingBoxValsAsync(setRestrinctingBox);
    }
  }, [JSON.stringify(rect)]);

  const calcRestrictingBoxValsAsync = (cb) => {
    if(Object.keys(rect).length === 0) {
      return null;
    }

    resizeableRectRef.current
      .measure((x, y, width, height, pageX, pageY) => {
        const window = Dimensions.get('window');
        
        const xMin = 0 - x;
        const xMax = window.width - x - width;

        const yMin = 0 - y;
        const yMax = window.height - y - height;

        cb({
          xMin: xMin,
          xMax: xMax,
          yMin: yMin,
          yMax: yMax,
        });
      });
  }
console.log(restrictingBox);
  return (
    <Animated.View
      ref={resizeableRectRef}
      style={[
        externalStyle,
        styles.box,
        {
          top: rect.y,
          left: rect.x,
          height: rect.height,
          width: rect.width,
        },
        {
          transform: [
            {
              translateX: pan.x.interpolate({
                inputRange: [restrictingBox.xMin, restrictingBox.xMax],
                outputRange: [restrictingBox.xMin, restrictingBox.xMax],
                extrapolate: 'clamp',
              }),
            },
            {
              translateY: pan.y.interpolate({
                inputRange: [restrictingBox.yMin, restrictingBox.yMax],
                outputRange: [restrictingBox.yMin, restrictingBox.yMax],
                extrapolate: 'clamp',
              }),
            },
            // {scaleX: horizontalStretchScale},
          ],
        },
      ]}
      {...panResponder.panHandlers}></Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  box: {
    backgroundColor: 'transparent',
    borderColor: config.colors.primary,
    borderWidth: 3,
    borderRadius: 5,
  },
});
