import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions, Alert, Easing } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

import ResizableRectangle from "./components/ResizableRectangle";

import AppPermissions from "../../utils/AppPermissions";
import config from "../../config";

export default function ECGCapture({ navigation }) {
    const cameraRef = useRef(null);
    const [innerRect, setInnerRect] = useState({});
    const [isVideo, setIsVideo] = useState(false);
    const [recordOpacityVal, setRecordOpacityVal] = useState(new Animated.Value(0));

    const calcRectPixels = (imageWidth, imageHeight) => {
        const xRatio = innerRect.x / Dimensions.get("window").width;
        let originX = imageWidth * xRatio;

        const widthRatio = innerRect.width / Dimensions.get("window").width;
        let width = imageWidth * widthRatio;

        const yRatio = innerRect.y / Dimensions.get("window").height;
        let originY = (imageHeight + 100) * yRatio;

        const heightRatio = innerRect.height / Dimensions.get("window").height;
        let height = imageHeight * heightRatio;

        return {
            originX: originY,
            originY: originX,
            width: width,
            height: height,
        };
    };

    const takePicture = () => {
        if (!cameraRef) {
            return;
        }

        cameraRef.current
            .takePictureAsync({
                quality: 1,
                exif: true,
            })
            .then((image) => {
                navigation.navigate("Preview", { image, rectPixels: calcRectPixels(image.width, image.height) });
            })
            .catch((error) => {
                console.error(error);
                Alert.alert("Please place bounding box within picture", "", [
                    {
                        text: "OK",
                        onPress: () => { },
                    },
                ]);
            });
    };

    const recordVideo = () => {
        const appPermissions = new AppPermissions();
        const audioRecordingPermission = appPermissions.getAudioRecordingPermission();
        if (!audioRecordingPermission) {
            Alert.alert(
                "Please enable Audio Recording to record Video",
                "Although we record muted video, the permission is required",
                [
                    {
                        text: "OK",
                        onPress: () => { },
                    },
                ]
            );

            return;
        }

        blinkWithFade();
        setIsVideo(true);

        cameraRef.current
            .recordAsync({
                quality: Camera.Constants.VideoQuality["2160p"],
                maxDuration: 10,
                mute: true,
            })
            .then((video) => {
                setIsVideo(false);
                navigation.navigate("Preview", { video, rectPixels: calcRectPixels(video.width, video.height) });
            });
    };

    const stopVideoRecord = () => {
        cameraRef.current.stopRecording();
    };

    const blinkWithFade = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(recordOpacityVal, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(recordOpacityVal, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ],
        {
            iterations: 10,
            useNativeDriver: true
        })).start();
    };

    return (
        <View style={styles.container}>
            <Camera
                flashMode={Camera.Constants.FlashMode.on}
                autoFocus={Camera.Constants.AutoFocus.on}
                type={Camera.Constants.Type.back}
                ratio={"16:9"}
                zoom={0}
                ref={cameraRef}
                style={styles.camera}
            >
                <View style={styles.overlayWrapper}>
                    <Text style={styles.leftSide}>This is the left side of the ECG plot</Text>
                    <ResizableRectangle
                        rect={innerRect}
                        setRect={setInnerRect}
                        externalStyle={{}}
                    />
                    {
                        isVideo ?
                        <Animated.View style={[styles.recordingIndicator, {opacity: recordOpacityVal}]}></Animated.View>
                            :
                            null
                    }
                    
                    <FontAwesome.Button
                        name="camera"
                        onPress={takePicture}
                        onLongPress={recordVideo}
                        onPressOut={stopVideoRecord}
                        backgroundColor="transparent"
                        size={50}
                    />
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    camera: {
        flex: 1,
        justifyContent: "center",
    },

    recordingIndicator: {
        position: "absolute",
        bottom: 80,
        height: 50,
        width: 50,
        backgroundColor: "red",
        borderRadius: 50,
    },

    overlayWrapper: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-end",
    },

    leftSide: {
        top: 50,
        position: "absolute",
        alignSelf: "center",
        color: config.colors.secondary,
        backgroundColor: config.colors.primary,
    },
});
