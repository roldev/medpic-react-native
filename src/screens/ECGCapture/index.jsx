import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

import config from "../../config";

export default function ECGCapture({ navigation }) {
    const cameraRef = useRef(null)

    const cropAsync = (image, originX, originY, width, height) => {
        return ImageManipulator.manipulateAsync(
            image.uri,
            [{ crop: {
                originX: originX,
                originY: originY,
                width: width,
                height: height
            }}],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG });
    };

    const takePicture = () => {
        if(!cameraRef) {
            return;
        }
        
        cameraRef.current.takePictureAsync({
            quality: 1,
            exif: true,
        })
            .then((image) => {
                const x = 170;
                const y = 200;
                const width = 3200;
                const height = 2000;
                console.log(x, y, width, height, image);
                return cropAsync(image, x, y, width, height);
            })
            .then((image) => {
                navigation.navigate("Preview", { image });
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
                <View style={styles.cropBox} ></View>
                <View style={styles.buttonContainer}>
                    <FontAwesome.Button 
                        name="camera" 
                        onPress={takePicture} 
                        backgroundColor="transparent"
                        size={50} />
                </View>
            </Camera>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    camera: {
        flex: 1,
        justifyContent: "center",
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-end"
    },

    cropBox: {
        position: "absolute",
        backgroundColor: "transparent",
        borderColor: config.colors.primary,
        borderWidth: 2,
        borderRadius: 5,
        alignSelf: "center",
        width: "70%",
        height: "70%"
    }

});