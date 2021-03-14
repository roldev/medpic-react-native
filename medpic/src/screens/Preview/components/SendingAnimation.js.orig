import React, { useState, useEffect } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";

export default function SendingAnimation({ ballColor, ringColor }) {
    const [turningDeg, setTurningDeg] = useState(new Animated.Value(0));

    useEffect(() => { turnAround(); }, []);

    const turnAround = () => {
        turningDeg.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"]
        });

        Animated.loop(Animated.sequence([
            Animated.timing(turningDeg, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(turningDeg, {
                toValue: 0,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ],
            { iterations: 100 }
        )).start();
    };
    const spinDegree = turningDeg.interpolate({ inputRange: [0, 1], outputRange: ["35deg", "395deg"] });
    return (
        <Animated.View style={[styles.container, {
            transform: [{ rotate: spinDegree }],
            borderColor: ringColor || "black"
        }]}>
            <Animated.View style={[styles.turningDetails, {
                transform: [{ rotate: "0deg" }],
                backgroundColor: ballColor || "white"
            }]}>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        position: "absolute",
        borderColor: "black",
        borderWidth: 4,
        borderRadius: 50,
    },

    turningDetails: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: "absolute",
        backgroundColor: "white",
    }
});