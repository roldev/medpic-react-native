import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import config from '../../config';

import UserData, {USER_HAS_AGREED_KEY} from '../../store/UserData';

import boxExample from '../../../assets/boxExample.png';

export default function Explanation({navigation}) {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleContinue = () => {
    if (!hasAgreed) {
      return;
    }

    const userDataAccess = new UserData();
    userDataAccess.setVal(USER_HAS_AGREED_KEY, 'true');

    navigation.navigate('SelectAction');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>medpic</Text>

      <View style={styles.explanationBlock}>
        <Text style={styles.text}>
          Please move the red frame to fit ECG plot and film for 10 seconds
        </Text>
        <Image
          source={boxExample}
          resizeMode="cover"
          style={styles.boxExample}
        />
        <Text style={styles.text}>The recording will automatically stop</Text>
      </View>
      <View style={styles.explanationBlock}>
        <Text style={[styles.text, styles.disclaimer]}>
          <Text style={{fontWeight: 'bold'}}>Disclaimer: </Text>This is not
          intended for medical purposes. You should always consult your health
          care professional about any questions or health issues you may have.
        </Text>
      </View>

      <View style={styles.checkboxWrapper}>
        <CheckBox
          onValueChange={() => {
            setHasAgreed(!hasAgreed);
          }}
          value={hasAgreed}
          disabled={false}
          tintColors={{
            true: config.colors.primary,
            false: '#aaaaaa',
          }}
          onCheckColor={config.colors.primary}
          onTintColor={config.colors.primary}
        />
        <Text style={[styles.text, styles.checkboxText]}>
          I have read and understood the instructions above
        </Text>
      </View>
      <View style={styles.buttonBlock}>
        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueBtn,
            !hasAgreed ? styles.disabledButton : null,
          ]}
          disabled={!hasAgreed}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: config.colors.primary,
    marginTop: 40,
    marginBottom: 20,
  },

  disclaimer: {
    color: 'red',
  },

  text: {
    color: config.colors.primary,
    fontSize: 19,
    marginBottom: 20,
    textAlign: 'center',
  },

  explanationBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  boxExample: {
    width: 324,
    height: 150,
    marginBottom: 10,
  },

  checkboxWrapper: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'center',
    paddingLeft: 20,
  },

  checkboxText: {
      flex: 1,
  },

  disabledButton: {
    backgroundColor: config.colors.disabled,
  },

  continueBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
    marginBottom: 10,
    height: 50,
    backgroundColor: config.colors.primary,
    borderRadius: 25,
  },

  continueText: {
    color: 'white',
    textTransform: 'uppercase',
  },
});
