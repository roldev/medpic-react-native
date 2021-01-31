import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import AppPermissions, { Permissions } from "../../utils/AppPermissions";
import NoPermission from "./components/NoPermission";

import config from "../../config";

export default function SelectAction({ navigation }) {
    const appPermissions = new AppPermissions();

    const [permissions, setPermissions] = useState(() => ({
        camera: appPermissions.checkPermissionsAsync(Permissions.CAMERA),
        mediaLibrary: appPermissions.checkPermissionsAsync(
            Permissions.MEDIA_LIBRARY
        ),
    }));

    useEffect(() => {
        getCameraPermission();
        getmediaLibraryPermissions();
    }, []);

    const getCameraPermission = async () => {
        const isGranted = await appPermissions.requestPermissionsAsync(
            Permissions.CAMERA
        );
        setPermissions({
            ...permissions,
            camera: isGranted,
        });
    };

    const getmediaLibraryPermissions = async () => {
        const isGranted = await appPermissions.requestPermissionsAsync(
            Permissions.MEDIA_LIBRARY
        );
        setPermissions({
            ...permissions,
            mediaLibrary: isGranted,
        });
    };

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.cancelled) {
            navigation.navigate("Preview", { image: result });
        }
    };

    const takePicture = async () => {
        navigation.navigate("ECGCapture");
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsCotainer}>
                {permissions.mediaLibrary && (
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <Text style={styles.buttonText}>Pick an image</Text>
                    </TouchableOpacity>
                )}

                {permissions.camera && (
                    <TouchableOpacity
                        onPress={takePicture}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Take a picture</Text>
                    </TouchableOpacity>
                )}
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