import React, {useState, useEffect} from 'react';
import {View, TextInput, Dimensions, Platform} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import config from '../../../config';

export default function DiagnosisPicker({
  selectedDiag,
  setSelectedDiag,
  customDiag,
  setCustomDiag,
  onToggleCB,
  onBackButtonCB,
}) {
  const [items, setItems] = useState([{id: 'Other', name: 'Other'}]);

  useEffect(() => {
    fetch(`${config.urls.baseUrl}${config.urls.paths.diagnosisOptions}`)
      .then((res) => res.json())
      .then((diagnosisOptions) => {
        const initialItems = items;
        const serverItems = diagnosisOptions.map(({id, name}) => ({
          id: id.toString(),
          name: name,
        }));
        setItems(serverItems.concat(initialItems));
      });
  }, []);

  const {height} = Dimensions.get('screen');
  const desiredHeight = Platform.OS === 'ios' ? 450 : height;
  const styles = stylesBuilder({height: desiredHeight});

  return (
    <View style={[styles.pickerWrapper]}>
      <MultiSelect
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={(selectedItems) => {
          setSelectedDiag(selectedItems);
        }}
        onToggleList={onToggleCB}
        onClearSelector={onBackButtonCB}
        selectedItems={selectedDiag}
        submitButtonColor={config.colors.primary}
        submitButtonText="Close"
        tagRemoveIconColor={config.colors.primary}
        tagBorderColor={config.colors.primary}
        tagTextColor={config.colors.primary}
        selectedItemTextColor="red"
        selectedItemIconColor={config.colors.secondary}
        searchInputPlaceholderText="Search Diagnoses..."
        searchInputStyle={styles.searchInput}
        fixedHeight={true}
        styleSelectorContainer={styles.selectorContainer}
      />

      {selectedDiag.indexOf('Other') !== -1 && (
        <View style={styles.input}>
          <TextInput
            value={customDiag}
            onChangeText={(diag) => setCustomDiag(diag)}
            placeholder="Other diagnoses"
            displayKey="name"
            style={styles.customDiag}
          />
        </View>
      )}
    </View>
  );
}

function stylesBuilder({height}) {
  return {
    pickerWrapper: {
      zIndex: 10,
      width: '100%',
      height: height,
      top: '10%',
    },

    selectorContainer: {
      zIndex: 10,
      height: height,
    },

    customDiag: {
      bottom: 0,
      backgroundColor: 'white',
      height: 40,
    },

    searchInput: {
      fontSize: 20,
    },

    input: {
      bottom: '10%',
      zIndex: 10,
    },
  };
}
