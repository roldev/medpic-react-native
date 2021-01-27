import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Network from 'expo-network';
import { View, StyleSheet, TouchableOpacity, Image, Text, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import 'react-native-get-random-values'; // must come before uuid
import { v4 as uuidv4 } from 'uuid';

import config from "../../config";

import AppPermissions, { Permissions } from "../../utils/AppPermissions";
import NoPermission from "./components/NoPermission";

export default function ECGCapture({ route, navigation }) {
    const appPermissions = new AppPermissions();
    
    const { userStoreAccess } = route.params;

    const [permissions, setPermissions] = useState(() => ({
        camera: appPermissions.checkPermissionsAsync(Permissions.CAMERA),
        cameraRoll: appPermissions.checkPermissionsAsync(
            Permissions.CAMERA_ROLL
        ),
    }));

    const [image, setImage] = useState(null);
    const [selectedDiag, setSelectedDiag] = useState("");
    const [customDiag, setCustomDiag] = useState(null);

    const [IP, setIP] = useState("");

    useEffect(() => {
        Network.getIpAddressAsync()
            .then((localIP) => { setIP(localIP); });
    });

    const getCameraPermission = async () => {
        const isGranted = await appPermissions.requestPermissionsAsync(
            Permissions.CAMERA
        );
        setPermissions({
            ...permissions,
            camera: isGranted,
        });
    };

    const getCameraRollPermissions = async () => {
        const isGranted = await appPermissions.requestPermissionsAsync(
            Permissions.CAMERA_ROLL
        );
        setPermissions({
            ...permissions,
            cameraRoll: isGranted,
        });
    };

    useEffect(() => {
        getCameraPermission();
        getCameraRollPermissions();
    }, []);

    if (!permissions.camera && !permissions.cameraRoll) {
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
            setImage(result.uri);
        }
    };

    const takePicture = async () => {
        let image = await ImagePicker.launchCameraAsync().catch((error) =>
            console.log({ error })
        );
        setImage(image.uri);
    };

    const send = async () => {
        const filename = uuidv4() + ".jpg";
        
        const userData = await userStoreAccess.getData();

        const formData = new FormData();
        formData.append("picture", {
            uri: image,
            name: filename,
            type: "image/jpg"
        });
        formData.append("filename", filename);
        formData.append("requestDataForAnalyze", JSON.stringify({
            userName: userData.name,
            userPhone: userData.phone,
            userPlace: userData.location,
            filename: filename,
            selectedItem: selectedDiag,
            customtype: customDiag,
            comment: "",
            angle: 0,
            clientIP: IP
        }));

        fetch(config.urls.uploadimage, {
            method: "POST",
            body: formData
        })
            .then((res) => {
                setImage(null);
                setSelectedDiag("");
                setCustomDiag(null);

                if(!res.ok) {
                    console.error({
                        status: res.status,
                        headers: res.headers
                    });

                    const alertHeader = "There was an error sending";
                    Alert.alert(alertHeader,
                        "",
                        [
                            {
                                text: "OK",
                                onPress: () => {}
                            }
                        ]);

                    return;
                }
                
                res.json()
                    .then((res) => {
                        const alertHeader = "Image Sent Successfully";
                        const alertMsg = `Heart Rate: ${res.data[1]}\nDiagnsis: ${res.data[3]}`;

                        Alert.alert(alertHeader,
                            alertMsg,
                            [
                                {
                                    text: "OK",
                                    onPress: () => {}
                                }
                            ]);
                    });
            })
            .catch((error) => {console.error(error)});
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsCotainer}>
                {permissions.camera && (
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <Text style={styles.buttonText}>Pick an image</Text>
                    </TouchableOpacity>
                )}

                {permissions.cameraRoll && (
                    <TouchableOpacity
                        onPress={takePicture}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Take a picture</Text>
                    </TouchableOpacity>
                )}

                {image && (
                    <>
                        <Image
                            source={{ uri: image }}
                            style={styles.previewImage}
                        />

                        <Picker
                            selectedValue={selectedDiag}
                            style={styles.dropDown}
                            onValueChange={(val) => {
                                setSelectedDiag(val);
                            }}
                        >
                            <Picker.Item
                                label="Choose Diagnosis"
                                value="placeholder"
                            />
                            <Picker.Item label="Uknown" value="unknown" />
                            <Picker.Item label="Normal" value="normal" />
                            <Picker.Item
                                label="Atrial fibrillation"
                                value="atrial fibrillation"
                            />
                            <Picker.Item label="I-AVB" value="i-avb" />
                            <Picker.Item label="RBBB" value="rbbb" />
                            <Picker.Item
                                label="Sinus Tachycardia"
                                value="sinus tachycardia"
                            />
                            <Picker.Item
                                label="ST-Changes, nonspecific"
                                value="st-changes, nonspecific"
                            />
                            <Picker.Item
                                label="Test Category"
                                value="test category"
                            />
                            <Picker.Item label="Other" value="other" />
                        </Picker>

                        {
                            selectedDiag === "other" &&
                            <View style={styles.input}>
                                <TextInput
                                    value={customDiag}
                                    onChangeText={(diag) =>
                                        (setCustomDiag(diag))
                                    }
                                    placeholder="Other diagnosis"
                                    placeholderTextColor="#003f5c"
                                    style={styles.inputText}
                                />
                            </View>
                        }
                        <TouchableOpacity onPress={send} style={styles.button}>
                            <Text style={styles.buttonText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </>
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

    dropDown: {
        backgroundColor: config.colors.primary,
        marginBottom: 10,
        color: "white",
    },

    previewImage: {
        width: 300,
        height: 300,
        marginBottom: 10,
        
    },

    input: {
        width: "100%",
        justifyContent: "center",
        backgroundColor: config.colors.inputBG,
        height: 50,
        marginBottom: 10,
        padding: 20
        
    },

    inputText: {
        height: 50,
        color: "white"
    },
});
