import React, { useState, useEffect } from "react";
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as Network from 'expo-network';
import 'react-native-get-random-values'; // must come before uuid
import { v4 as uuidv4 } from 'uuid';
import { Picker } from "@react-native-picker/picker";

import rotateRightIcon from "../../../assets/rotateright.png";
import rotateLeftIcon from "../../../assets/rotateleft.png";

import UserData from "../../store/UserData";
import config from "../../config";

export default function Preview({ route, navigation }) {
    const [image, setImage] = useState(route.params.image);
    const [selectedDiag, setSelectedDiag] = useState("");
    const [customDiag, setCustomDiag] = useState(null);

    const [IP, setIP] = useState("");

    useEffect(() => {
        Network.getIpAddressAsync()
            .then((localIP) => { setIP(localIP); });
    });

    const rotate90Right = () => {
        ImageManipulator.manipulateAsync(
            image.uri,
            [{ rotate: 90 }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG })
            .then((newImage) => { setImage(newImage); });
    };
    
    const rotate90Left = () => {
        ImageManipulator.manipulateAsync(
            image.uri,
            [{ rotate: -90 }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG })
            .then((newImage) => { setImage(newImage); });
    };

    const send = async () => {
        const filename = uuidv4() + ".jpg";
        
        const userStoreAccess = new UserData();
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
            .catch((error) => {
                Alert.alert("There was an error sending",
                    "",
                    [
                        {
                            text: "OK",
                            onPress: () => {}
                        }
                    ]);
                console.error(error)
            });
    };

    return (
        <View style={styles.container}>
            {
                image && 
                <View style={styles.imageWrapper}>
                    <Image source={{uri: image.uri}} style={styles.image} />
                    <View style={styles.pickerWrapper}>
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
                        </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={rotate90Left} style={styles.rotateButton}>
                            <Image source={rotateLeftIcon} style={styles.rotateIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={send} style={styles.button}>
                            <Text style={styles.buttonText}>SUBMIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={rotate90Right} style={styles.rotateButton}>
                            <Image source={rotateRightIcon} style={styles.rotateIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },

    imageWrapper: {
        flex: 1,
        backgroundColor: config.colors.secondary
    },

    image: {
        marginTop: 40,
        resizeMode: "contain",
        flex: 1
    },

    buttonsContainer: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "flex-end",
        justifyContent: "space-around",
        top: 0
    },

    rotateIcon: {
        width: 50,
        height: 50,
    },

    pickerWrapper: {
        marginBottom: 70,
        alignItems: "center"
    },

    dropDown: {
        backgroundColor: config.colors.primary,
        textAlign: "center",
        color: "white",
        width: "50%",
        zIndex: 200
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

    input: {
        width: "50%",
        justifyContent: "center",
        backgroundColor: config.colors.inputBG,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        zIndex: 10
        
    },

    inputText: {
        height: 50,
        color: "white"
    },
});
