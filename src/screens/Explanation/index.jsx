import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import config from "../../config";

import boxExample from "../../../assets/boxExample.jpg";

export default function ECGCapture({ navigation }) {

    const handleContinue = () => { navigation.navigate("ECGCapture"); };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>medpic</Text>
            <View style={styles.explanationBlock}>
                <Text style={styles.text}>Please move the red frame to fit ECG plot</Text>
                <Image source={boxExample} resizeMode="cover" style={styles.boxExample} />
            </View>
            <View style={styles.explanationBlock}>
                <Text style={styles.text}>Short press for a still photo, long for video</Text>
                <View style={styles.cameraIconsWrapper}>
                    <FontAwesome
                        name="camera"
                        backgroundColor="transparent"
                        color="white"
                        size={50}
                    />
                    <FontAwesome
                        name="video-camera"
                        backgroundColor="transparent"
                        color="white"
                        size={50}
                    />
                </View>
            </View>
            <View style={styles.buttonBlock}>
                <TouchableOpacity onPress={handleContinue} style={styles.continueBtn}>
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.secondary,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: config.colors.primary,
        marginTop: 40,
        marginBottom: 40
    },

    text: {
        color: config.colors.primary,
        fontSize: 19,
        marginBottom: 20,
    },

    explanationBlock: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    
    buttonBlock: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
    },

    boxExample: {
        width: 324,
        height: 150,
    },

    cameraIconsWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 300
    },

    continueBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        marginTop: 40,
        marginBottom: 10,
        height: 50,
        backgroundColor: config.colors.primary,
        borderRadius: 25
    },

    continueText: {
        color: "white",
        textTransform: "uppercase"
    }
});