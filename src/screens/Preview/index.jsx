import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Video } from "expo-av";
import "react-native-get-random-values"; // must come before uuid
import { v4 as uuidv4 } from "uuid";

import DiagnosisPicker from "./components/DiagnosisPicker";
import SendingAnimation from "./components/SendingAnimation";

import UserData from "../../store/UserData";
import config from "../../config";

export default function Preview({ route, navigation }) {
    const [video, setVideo] = useState(route.params.video);

    const [selectedDiag, setSelectedDiag] = useState([]);
    const [customDiag, setCustomDiag] = useState(null);

    const [isSending, setIsSending] = useState(false);

    const rectPixels = route.params.rectPixels
        ? { overlay: route.params.rectPixels }
        : {};

    const send = async () => {
        setIsSending(true);

        const filename = uuidv4() + ".jpg";

        const userStoreAccess = new UserData();
        const userData = await userStoreAccess.getData();

        const formData = new FormData();

        if (video) {
            formData.append("video", {
                uri: video.uri,
                name: filename,
                type: "video/mp4",
            });
        }

        formData.append("filename", filename);
        formData.append(
            "requestDataForAnalyze",
            JSON.stringify(
                Object.assign(
                    {
                        userId: userData.userId,
                        filename: filename,
                        selectedDiags: selectedDiag.join(","),
                        customDiag: customDiag,
                        angle: 0,
                    },
                    rectPixels
                )
            )
        );

        fetch(`${config.urls.baseUrl}${config.urls.paths.uploadimage}`, {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    console.error({
                        status: res.status,
                        headers: res.headers,
                    });

                    const alertHeader = "There was an error sending";
                    Alert.alert(alertHeader, "", [
                        {
                            text: "OK",
                            onPress: () => { },
                        },
                    ]);

                    return;
                }

                setVideo(null);
                setSelectedDiag([]);
                setCustomDiag(null);

                res.json().then((res) => {
                    const alertHeader = "Image Sent Successfully";
                    const alertMsg = `Heart Rate: ${res.data.heartRate}\nDiagnsis: ${res.data.diagnosis}`;

                    Alert.alert(alertHeader, alertMsg, [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.navigate("SelectAction");
                            },
                        },
                    ]);
                });
            })
            .catch((error) => {
                Alert.alert("There was an error sending", "", [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.navigate("SelectAction");
                        },
                    },
                ]);
                console.error(error);
            })
            .finally(() => { setIsSending(false); });
    };

    if (!video) {
        return <Text>No video supplied</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.previewWrapper}>
                <Text style={styles.leftSide}>This is the left side of the ECG plot</Text>

                {video ? (
                    <Video
                        source={video}
                        rate={1.0}
                        isMuted={true}
                        resizeMode="contain"
                        shouldPlay={true}
                        isLooping={true}
                        style={styles.video}
                    />
                ) : (
                        null
                    )}

                {isSending ?
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <SendingAnimation ringColor={config.colors.primary} ballColor={config.colors.primary} />
                        <Text style={styles.sendingText}>Sending...</Text>
                    </View>
                    :
                    <DiagnosisPicker
                        selectedDiag={selectedDiag}
                        setSelectedDiag={setSelectedDiag}
                        customDiag={customDiag}
                        setCustomDiag={setCustomDiag}
                    />}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={send} style={styles.button}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },

    previewWrapper: {
        flex: 1,
        backgroundColor: config.colors.secondary,
    },

    image: {
        marginTop: 40,
        resizeMode: "contain",
        flex: 1,
    },

    video: {
        margin: 40,
        flex: 1,
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
        top: 0,
    },

    rotateIcon: {
        width: 50,
        height: 50,
    },

    rotateButton: {
        zIndex: 10,
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: config.colors.primary,
        zIndex: 3,
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
        zIndex: 10,
    },

    inputText: {
        height: 50,
        color: "white",
    },

    leftSide: {
        position: "absolute",
        color: config.colors.secondary,
        backgroundColor: config.colors.primary,
        top: 100,
        alignSelf: "center",
        zIndex: 5,
    },

    sendingText: {
        top: 50,
        fontSize: 30,
        color: config.colors.primary,
    },
});
