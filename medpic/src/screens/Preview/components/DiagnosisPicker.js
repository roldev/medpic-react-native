import React, {useState, useEffect} from 'react';
import {View, TextInput} from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import config from '../../../config';

export default function DiagnosisPicker({
  selectedDiag,
  setSelectedDiag,
  customDiag,
  setCustomDiag,
  onToggleCB,
  onBackButtonCB,
}) {
  const [items, setItems] = useState([{id: 'Other', item: 'Other'}]);

  useEffect(() => {
    fetch(`${config.urls.baseUrl}${config.urls.paths.diagnosisOptions}`)
      .then((res) => res.json())
      .then((diagnosisOptions) => {
        const initialItems = items;
        const serverItems = diagnosisOptions.map(({id, name}) => ({
          id: id.toString(),
          item: name,
        }));
        setItems(serverItems.concat(initialItems));
      });
  }, []);

  function onMultiChange() {
    return (item) => {
      const itemIdx = selectedDiag.findIndex((currentItem) => (currentItem.id === item.id));
      let newSelectedDiag = [];
      if(itemIdx === -1) {
        newSelectedDiag = selectedDiag.concat(item);
      } else {
        newSelectedDiag = [...selectedDiag];
        newSelectedDiag.splice(itemIdx, 1);
      }
      setSelectedDiag(newSelectedDiag);
    };
  }

  const styles = stylesBuilder();

  return (
    <View style={[styles.pickerWrapper]}>
      {items.length > 0 && <SelectBox 
        inputPlaceholder='Search Diagnoses...'
        options={items}
        selectedValues={selectedDiag}
        onMultiSelect={onMultiChange()}
        inputFilterContainerStyle={styles.diag}
        optionsLabelStyle={styles.diag}
        optionContainerStyle={styles.diag}
        containerStyle={styles.diag}        
        isMulti
      />}
      {selectedDiag.findIndex((currentItem) => (currentItem.id === 'Other')) !== -1 && (
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

function stylesBuilder() {
  return {
    pickerWrapper: {
      zIndex: 10,
      width: '100%',
      height: 400,
      top: '10%',
    },

    selectorContainer: {
      zIndex: 10,
      height: 400,
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
      marginTop: 10,
      zIndex: 10,
    },

    diag: {
      backgroundColor: 'white'
    }, 
  };
}
