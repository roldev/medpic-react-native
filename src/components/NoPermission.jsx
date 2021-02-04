import React from "react";
import { View, Text, StyleSheet } from "react-native";

import config from "../config";

export default function ECGCapture({ error, errorDetails }) {
    return (
        <View style={styles.container}>
            <Text style={styles.error}>{error}</Text>
            <Text style={styles.errorDetails}>{errorDetails}</Text>
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
    error: {
        fontSize: 30,
        fontWeight: "bold",
        color: config.colors.error,
    },
    errorDetails: {
        fontSize: 15,
        color: config.colors.error,
    },
});
