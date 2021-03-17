import React, {useState, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Dimensions, View} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

import config from '../config';

export default function ResizableRectangle({
  rect,
  setRect,
  limitingRect,
  externalStyle,
}) {
  const resizeableRectRef = useRef(null);

  // pan
  const panRef = useRef(null);
  const [pos, setPos] = useState({
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    lastOffset: {
      x: 0,
      y: 0,
    },
  });

  // zoom
  const zoomRef = useRef(null);
  const [localSize, setLocalSize] = useState({
    baseScale: new Animated.Value(1),
    pinchScale: new Animated.Value(1),
    scale: new Animated.Value(1),
    lastScale: 1,
  });

  const handlePanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: pos.translateX,
          translationY: pos.translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const handlePanStateChange = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE && resizeableRectRef.current) {
      resizeableRectRef.current.measureInWindow((x, y, width, height) => {
        let newLastOffsetX = pos.lastOffset.x + nativeEvent.translationX;
        if (x < limitingRect.x) {
          newLastOffsetX += limitingRect.x - x;
        }
        if (x + width > limitingRect.x + limitingRect.width) {
          newLastOffsetX += (limitingRect.x + limitingRect.width) - (x + width);
        }

        let newLastOffsetY = pos.lastOffset.y + nativeEvent.translationY;
        if (y < limitingRect.y) {
          newLastOffsetY += limitingRect.y - y;
        }
        if (y + height > limitingRect.y + limitingRect.y + width) {
          newLastOffsetY += (limitingRect.y + limitingRect.height) - (y + height);
        }

        setPos({
          ...pos,
          lastOffset: {
            x: newLastOffsetX,
            y: newLastOffsetY,
          },
        });

        pos.translateX.setOffset(newLastOffsetX);
        pos.translateX.setValue(0);
        pos.translateY.setOffset(newLastOffsetY);
        pos.translateY.setValue(0);

        const newX = rect.x + nativeEvent.translationX;
        const newY = rect.y + nativeEvent.translationY;

        setRect({
          ...rect,
          x: newX,
          y: newY,
        });
      });
    }
  };

  const handlePinchEvent = Animated.event(
    [{nativeEvent: {scale: localSize.pinchScale}}],
    {useNativeDriver: true},
  );

  const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newLastScale = localSize.lastScale * event.nativeEvent.scale;
      localSize.baseScale.setValue(newLastScale);
      localSize.pinchScale.setValue(1);

      setLocalSize({
        ...localSize,
        lastScale: newLastScale,
      });

      const newWidth = rect.width * newLastScale;
      const newHeight = rect.height * newLastScale;

      setRect({
        ...rect,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={handlePinchEvent}
      onHandlerStateChange={handlePinchStateChange}
      ref={zoomRef}
      simultaneousHandlers={panRef}>
      <Animated.View style={styles.wrapper}>
        <PanGestureHandler
          onGestureEvent={handlePanEvent}
          onHandlerStateChange={handlePanStateChange}
          ref={panRef}
          simultaneousHandlers={zoomRef}>
          <Animated.View
            ref={resizeableRectRef}
            style={[
              externalStyle,
              styles.box,
              {
                height: rect.height,
                width: rect.width,
              },
              {
                transform: [
                  {translateX: pos.translateX},
                  {translateY: pos.translateY},
                  {
                    scale: Animated.multiply(
                      localSize.baseScale,
                      localSize.pinchScale,
                    ),
                  },
                ],
              },
            ]}
          />
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 15,
  },

  box: {
    backgroundColor: 'transparent',
    borderColor: config.colors.primary,
    borderWidth: 2,
    borderRadius: 5,
  },
});
