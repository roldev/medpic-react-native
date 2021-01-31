import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImageManipulator from 'expo-image-manipulator';

import rotateRightIcon from "../../../assets/rotateright.png";
import rotateLeftIcon from "../../../assets/rotateleft.png";
import config from "../../config";

export default function Preview({ route, navigation }) {
    const [image, setImage] = useState(route.params.image);

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

    return (
        <View style={styles.container}>
            {
                image && 
                <View style={styles.imageWrapper}>
                    <Image source={{uri: image.uri}} style={styles.image} />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={rotate90Left} style={styles.rotateButton}>
                            <Image source={rotateLeftIcon} style={styles.rotateIcon} />
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

    rotateButton: {
        
    },

    rotateIcon: {
        width: 50,
        height: 50,
    }
});
