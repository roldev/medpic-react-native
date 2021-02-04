import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";

import config from "../../../config";

export default function ResizableRectangle({ rect, setRect, externalStyle }) {
    // pan
    const panRef = useRef(null);
    const [pos, setPos] = useState({
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        lastOffset: {
            x: 0,
            y: 0
        }
    });

    // zoom
    const zoomRef = useRef(null);
    const [localSize, setLocalSize] = useState({
        baseScale: new Animated.Value(1),
        pinchScale: new Animated.Value(1),
        scale: new Animated.Value(1),
        lastScale: 1
    });

    const handlePanEvent = Animated.event(
        [
            {
                nativeEvent: {
                    translationX: pos.translateX,
                    translationY: pos.translateY
                },
            },
        ],
        { useNativeDriver: true }
    );

    const handlePanStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const newLastOffsetX = pos.lastOffset.x + event.nativeEvent.translationX;
            const newLastOffsetY = pos.lastOffset.y + event.nativeEvent.translationY;

            setPos({
                ...pos,
                lastOffset: {
                    x: newLastOffsetX,
                    y: newLastOffsetY
                }
            });
            
            pos.translateX.setOffset(newLastOffsetX);
            pos.translateX.setValue(0);
            pos.translateY.setOffset(newLastOffsetY);
            pos.translateY.setValue(0);

            const newX = rect.x + event.nativeEvent.translationX;
            const newY = rect.y + event.nativeEvent.translationY;

            setRect({
                ...rect,
                x: newX,
                y: newY
            });
        }
    };

    const handlePinchEvent = Animated.event(
        [{ nativeEvent: { scale: localSize.pinchScale }}],
        { useNativeDriver: true }
    );

    const handlePinchStateChange = (event) => {
        if(event.nativeEvent.oldState === State.ACTIVE) {
            const newLastScale = localSize.lastScale * event.nativeEvent.scale;
            localSize.baseScale.setValue(newLastScale);
            localSize.pinchScale.setValue(1);

            setLocalSize({
                ...localSize,
                lastScale: newLastScale
            });

            const newWidth = rect.width * newLastScale;
            const newHeight = rect.height * newLastScale;

            setRect({
                ...rect,
                width: newWidth,
                height: newHeight
            });
        }
    };

    const handleLayout = (event) => {
        setRect(event.nativeEvent.layout);
    };

    useEffect(() => {}, [JSON.stringify(localSize)]);

    return (
        <PanGestureHandler
            onGestureEvent={handlePanEvent}
            onHandlerStateChange={handlePanStateChange}
            ref={panRef}
            simultaneousHandlers={zoomRef}>
            <Animated.View style={styles.wrapper}>
            <PinchGestureHandler
                    onGestureEvent={handlePinchEvent}
                    onHandlerStateChange={handlePinchStateChange}
                    ref={zoomRef}
                    simultaneousHandlers={panRef}>
                    <Animated.View 
                        onLayout={handleLayout}
                        style={[
                            externalStyle,
                            styles.box,
                            {
                                transform: [
                                    { translateX: pos.translateX },
                                    { translateY: pos.translateY },
                                    { scale: Animated.multiply(localSize.baseScale, localSize.pinchScale) }
                                ]
                            }
                        ]}
                    />
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },

    box: {
        backgroundColor: "transparent",
        borderColor: config.colors.primary,
        borderWidth: 2,
        borderRadius: 5,        
        width: "70%",
        height: "70%",
    },
});