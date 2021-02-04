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
import { Picker } from "@react-native-picker/picker";

export default function DiagnosisPicker({
    selectedDiag,
    setSelectedDiag,
    customDiag,
    setCustomDiag,
}) {
    return (
        <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={selectedDiag}
                style={styles.dropDown}
                onValueChange={(val) => {
                    setSelectedDiag(val);
                }}
            >
                <Picker.Item label="Choose Diagnosis" value="placeholder" />
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
                <Picker.Item label="Test Category" value="test category" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            {selectedDiag === "other" && (
                <View style={styles.input}>
                    <TextInput
                        value={customDiag}
                        onChangeText={(diag) => setCustomDiag(diag)}
                        placeholder="Other diagnosis"
                        placeholderTextColor="#003f5c"
                        style={styles.inputText}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pickerWrapper: {
        marginBottom: 70,
        alignItems: "center",
    },

    dropDown: {
        backgroundColor: config.colors.primary,
        textAlign: "center",
        color: "white",
        width: "50%",
        zIndex: 200,
    },
});
