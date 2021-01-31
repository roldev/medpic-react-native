import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from '@expo/vector-icons';

export default function ECGCapture({ navigation }) {
    const cameraRef = useRef(null)

    const takePicture = () => {
        if(!cameraRef) {
            return;
        }
        
        cameraRef.current.takePictureAsync({
            quality: 1,
            exif: true,
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
        flex: 1
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-end"
    },

});