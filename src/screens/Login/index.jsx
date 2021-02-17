import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import config from "../../config";

import locationIcon from "../../../assets/location.png";
import UserData, { USER_NAME_KEY, USER_PHONE_KEY, USER_LOCATION_KEY, USER_HAS_VISITED_INTRO_KEY } from "../../store/UserData";
import AppPermissions from "../../utils/AppPermissions";

export default function Login({ navigation }) {
    const userStoreAccess = new UserData();
    const appPermissions = new AppPermissions();

    const [userData, setUserData] = useState({
        name: "",
        location: "",
        phone: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        userStoreAccess.getData().then((data) => {
            setUserData({
                name: data[USER_NAME_KEY] ? data[USER_NAME_KEY] : "",
                location: data[USER_LOCATION_KEY] ? data[USER_LOCATION_KEY] : "",
                phone: data[USER_PHONE_KEY] ? data[USER_PHONE_KEY] : ""
            });
        });
    }, []);

    const getLocationAsync = async () => {
        const isGranted = await appPermissions.getLocationPermission(Permissions.LOCATION);
        if(!isGranted) {
            setError("Permission to access location was denied");
            return;
        }

        const { coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest});

        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        let finalLocation = "";
        if(addresses.length < 0) {
            finalLocation = JSON.stringify(location.latitude, location.longitude);

            setError("Could not translate coordinates to address");
        } 
        else {
            finalLocation = `${addresses[0].city}, ${addresses[0].country}`;
        }
        
        setUserData({...userData, location: finalLocation});
    };

    const handleSave = () => {
        userStoreAccess.setData({
            USER_NAME_KEY: userData.name, 
            USER_PHONE_KEY: userData.phone, 
            USER_LOCATION_KEY: userData.location,
        });
        
        userStoreAccess.getVal(USER_HAS_VISITED_INTRO_KEY)
            .then((hasVisitedIntro) => {
                const nextPage = hasVisitedIntro == "true" ? "SelectAction" : "Explanation";
                navigation.navigate(nextPage);
            })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>medpic</Text>
            <View style={styles.input}>
                <TextInput
                    value={userData.name}
                    onChangeText={(name) => (setUserData({...userData, name}))} 
                    placeholder="Name..." 
                    placeholderTextColor={config.colors.inputPlaceHolder} 
                    style={styles.inputText} />
            </View>
            <View style={styles.input}>
                <TextInput 
                    value={userData.phone}
                    onChangeText={(phone) => (setUserData({...userData, phone}))}
                    placeholder="Phone Number..."
                    placeholderTextColor={config.colors.inputPlaceHolder}
                    style={styles.inputText} />
            </View>
            <View style={styles.locationWrapper}>
                <View style={styles.input}>
                    <TextInput
                        value={userData.location}
                        onChangeText={(location) => (setUserData({...userData, location}))} 
                        placeholder="City, Country..."
                        placeholderTextColor="#003f5c" 
                        style={styles.inputText} />
                </View>

                <TouchableOpacity onPress={getLocationAsync} style={styles.locationBtn}>
                    <Image source={locationIcon} style={styles.locationIcon} />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleSave} style={styles.loginBtn}>
                <Text style={styles.loginText}>save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.secondary,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: config.colors.primary,
        marginBottom: 40
    },

    input: {
        width: "80%",
        justifyContent: "center",
        backgroundColor: config.colors.inputBG,
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        padding: 20
        
    },

    locationWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "90%"
    },

    location: {
        justifyContent: "center",
        backgroundColor: config.colors.inputBG,
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        padding: 20
        
    },

    locationBtn: {
        alignItems: "center",
        justifyContent: "center",
    },

    locationIcon: {
        width: 20,
        height: 30,
        marginLeft: 5,
        marginBottom: 16
    },

    inputText: {
        height: 50,
        color: "white"
    },

    loginBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        marginTop: 40,
        marginBottom: 10,
        height: 50,
        backgroundColor: config.colors.primary,
        borderRadius: 25
    },

    loginText: {
        color: "white",
        textTransform: "uppercase"
    }
});
