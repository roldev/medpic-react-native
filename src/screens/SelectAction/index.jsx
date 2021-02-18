import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import AppPermissions from "../../utils/AppPermissions";
import NoPermission from "../../components/NoPermission";

import config from "../../config";

export default function SelectAction({ navigation }) {
    const appPermissions = new AppPermissions();

    const [permissions, setPermissions] = useState({
        camera: false,
        mediaLibrary: false,
    });

    useEffect(() => {
        const cameraPermission = appPermissions.getCameraPermission();
        const mediaLibraryPermission = appPermissions.getMediaLibraryPermission();

        setPermissions({
            camera: cameraPermission,
            mediaLibrary: mediaLibraryPermission,
        });
    }, []);

    if (!permissions.camera && !permissions.mediaLibrary) {
        return (
            <NoPermission
                error="No Access to camera"
                errorDetails="Please enable the camera through the settings"
            />
        );
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            navigation.navigate("Preview", { video: result });
        }
    };

    const recordVideo = async () => {
        navigation.navigate("ECGCapture");
    };

    const goToExplanation = async () => {
        navigation.navigate("Explanation");
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsCotainer}>
                {permissions.mediaLibrary && (
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <Text style={styles.buttonText}>Pick a video</Text>
                    </TouchableOpacity>
                )}

                {permissions.camera && (
                    <TouchableOpacity
                        onPress={recordVideo}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Record a video</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={goToExplanation}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>What should I do?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: config.colors.secondary,
    },

    buttonsCotainer: {
        justifyContent: "center",
        alignItems: "stretch",
        margin: 20,
        width: 300,
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: config.colors.primary,
    },

    buttonText: {
        color: "white",
    },
});
