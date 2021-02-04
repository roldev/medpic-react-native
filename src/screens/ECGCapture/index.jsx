import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

import ResizableRectangle from "./components/ResizableRectangle";

import config from "../../config";

export default function ECGCapture({ navigation }) {
    const cameraRef = useRef(null);
    const [innerRect, setInnerRect] = useState({});

    const cropAsync = (image, originX, originY, width, height) => {
        return ImageManipulator.manipulateAsync(
            image.uri,
            [
                {
                    crop: {
                        originX: originY,
                        originY: originX,
                        width: height,
                        height: width,
                    },
                },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
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
                const xRatio = (innerRect.x / Dimensions.get("window").width);
                let originX = image.width * xRatio;
                

                const widthRatio = innerRect.width / Dimensions.get("window").width;
                let width = image.width * widthRatio;

                const yRatio = (innerRect.y / Dimensions.get("window").height);
                let originY = (image.height * yRatio) + 100;

                const heightRatio = innerRect.height / Dimensions.get("window").height;
                let height = image.height * heightRatio;

                return cropAsync(image, originX, originY, width, height);
            })
            .then((image) => {
                navigation.navigate("Preview", { image });
            })
            .catch((error) => {
                console.error(error);
                Alert.alert("Please place bounding box within picture",
                "",
                [
                    {
                        text: "OK",
                        onPress: () => {}
                    }
                ]);
            });
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
                    <ResizableRectangle
                        rect={innerRect}
                        setRect={setInnerRect}
                        externalStyle={{}}
                    />
                    <FontAwesome.Button
                        name="camera"
                        onPress={takePicture}
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

    overlayWrapper: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-end",
    },
});
