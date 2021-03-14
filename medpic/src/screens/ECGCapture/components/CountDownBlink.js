import React, { useState, useEffect } from "react";
import { Animated, Text, StyleSheet, Easing } from "react-native";

export default function CountDownBlink({ seconds, style, countDownColor }) {
    const [blinkOpacity, setBlinkOpacity] = useState(new Animated.Value(0));
    const [counter, setCounter] = useState(seconds);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCounter = counter - 1;
            setCounter(newCounter);
        }, 1000);

        blinkWithFade();

        return () => { clearInterval(interval); };
    });

    const blinkWithFade = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(blinkOpacity, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(blinkOpacity, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ],
            {
                iterations: -1,
                useNativeDriver: true
            })).start();
    };

    return (
        <Animated.View style={[styles.blinkBall, style, { opacity: blinkOpacity }]}>
            <Text style={[styles.countDown, {color: countDownColor}]}>{counter}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    blinkBall: {
        position: "absolute",
        bottom: 80,
        height: 50,
        width: 50,
        backgroundColor: "red",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    countDown: {
        fontWeight: "bold",
        fontSize: 20,
    }
});