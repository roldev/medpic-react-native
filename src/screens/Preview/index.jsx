import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Video } from "expo-av";
import * as ImageManipulator from "expo-image-manipulator";
import * as Network from "expo-network";
import "react-native-get-random-values"; // must come before uuid
import { v4 as uuidv4 } from "uuid";

import DiagnosisPicker from "./components/DiagnosisPicker";

import rotateRightIcon from "../../../assets/rotateright.png";
import rotateLeftIcon from "../../../assets/rotateleft.png";

import UserData from "../../store/UserData";
import config from "../../config";

export default function Preview({ route, navigation }) {
    const [image, setImage] = useState(route.params.image);
    const [video, setVideo] = useState(route.params.video);

    const [selectedDiag, setSelectedDiag] = useState([]);
    const [customDiag, setCustomDiag] = useState(null);

    const [IP, setIP] = useState("");

    const rectPixels = route.params.rectPixels
        ? { overlay: route.params.rectPixels }
        : {};

    useEffect(() => {
        Network.getIpAddressAsync().then((localIP) => {
            setIP(localIP);
        });
    });

    const rotate90Right = () => {
        ImageManipulator.manipulateAsync(image.uri, [{ rotate: 90 }], {
            compress: 1,
            format: ImageManipulator.SaveFormat.PNG,
        }).then((newImage) => {
            setImage(newImage);
        });
    };

    const rotate90Left = () => {
        ImageManipulator.manipulateAsync(image.uri, [{ rotate: -90 }], {
            compress: 1,
            format: ImageManipulator.SaveFormat.PNG,
        }).then((newImage) => {
            setImage(newImage);
        });
    };

    const send = async () => {
        const filename = uuidv4() + ".jpg";

        const userStoreAccess = new UserData();
        const userData = await userStoreAccess.getData();

        const formData = new FormData();

        if (image) {
            formData.append("picture", {
                uri: image.uri,
                name: filename,
                type: "image/jpg",
            });
        }
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
                        userName: userData.name,
                        userPhone: userData.phone,
                        userPlace: userData.location,
                        filename: filename,
                        selectedItem: selectedDiag.join(", "),
                        customtype: customDiag,
                        comment: "",
                        angle: 0,
                        clientIP: IP,
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
                            onPress: () => {},
                        },
                    ]);

                    return;
                }

                setImage(null);
                setSelectedDiag([]);
                setCustomDiag(null);

                res.json().then((res) => {
                    const alertHeader = "Image Sent Successfully";
                    const alertMsg = `Heart Rate: ${res.data[1]}\nDiagnsis: ${res.data[3]}`;

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
            });
    };

    if (!image && !video) {
        return <Text>No video or image supplied to screen</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.previewWrapper}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.image} />
                ) : (
                    <Video
                        source={video}
                        rate={1.0}
                        isMuted={true}
                        resizeMode="contain"
                        shouldPlay={true}
                        isLooping={true}
                        style={styles.video}
                    />
                )}

                <DiagnosisPicker
                    selectedDiag={selectedDiag}
                    setSelectedDiag={setSelectedDiag}
                    customDiag={customDiag}
                    setCustomDiag={setCustomDiag}
                />

                <View style={styles.buttonsContainer}>
                    {image && (
                        <TouchableOpacity
                            onPress={rotate90Left}
                            style={styles.rotateButton}
                        >
                            <Image
                                source={rotateLeftIcon}
                                style={styles.rotateIcon}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={send} style={styles.button}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                    {image && (
                        <TouchableOpacity
                            onPress={rotate90Right}
                            style={styles.rotateButton}
                        >
                            <Image
                                source={rotateRightIcon}
                                style={styles.rotateIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
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
});
