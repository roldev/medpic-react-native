import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import MultiSelect from "react-native-multiple-select";
import config from "../../../config";

export default function DiagnosisPicker({
    selectedDiag,
    setSelectedDiag,
    customDiag,
    setCustomDiag,
}) {
    const [items, setItems] = useState([{ id: "Other", name: "Other" }]);

    useEffect(() => {
        fetch(`${config.urls.baseUrl}${config.urls.paths.diagnosisOptions}`)
            .then((res) => res.json())
            .then((diagnosisOptions) => {
                const initialItems = items;
                const serverItems = diagnosisOptions.map(({id, name}) => ({ id: id.toString(), name: name }));
                setItems(serverItems.concat(initialItems));
            });
    }, []);

    return (
        <View style={styles.pickerWrapper}>
            <MultiSelect
                items={items}
                uniqueKey="id"
                onSelectedItemsChange={(selectedItems) => {
                    setSelectedDiag(selectedItems);
                }}
                selectedItems={selectedDiag}
            />

            {selectedDiag.indexOf("Other") !== -1 && (
                <View style={styles.input}>
                    <TextInput
                        value={customDiag}
                        onChangeText={(diag) => setCustomDiag(diag)}
                        placeholder="Other diagnoses"
                        placeholderTextColor="#003f5c"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="red"
                        selectedItemIconColor={config.colors.secondary}
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: "#CCC" }}
                        submitButtonColor={config.colors.primary}
                        submitButtonText="Close"
                        style={styles.customDiag}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pickerWrapper: {
        flex: 1,
        zIndex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "flex-end",
        bottom: 70,
    },

    customDiag: {
        bottom: 0,
        backgroundColor: "white",
        height: 40,
    },
});
