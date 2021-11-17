import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SubmissionResult, { SUBMISSION_FILE } from '../../store/SubmissionResult';
import config from '../../config';

export default function SubmissionResultView({navigation}) {
  const [header, setHeader] = useState('');
  const [result, setResult] = useState('');

  const submissionResultDataAccess = new SubmissionResult();

  useEffect(() => {
    setHeader('Fetching Result');
    submissionResultDataAccess.getVal(SUBMISSION_FILE).then((filename) => {
      fetch(`${config.urls.baseUrl}${config.urls.paths.analyzeFile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ecgName: filename
        })
      })
        .then((res) => {
          setHeader('ECG Analysis Result');
  
          if (!res.ok) {
            console.error({
              status: res.status,
              headers: res.headers,
            });
  
            setResult('There was an error getting analysis');
            
            return;
          }
  
          res
            .json()
            .then((res) => {
              let notificationContent = 'No result was retrieved';
              
              if(res.data) {
                notificationContent = res.data;
              }
  
              setResult(notificationContent);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{header}</Text>

      <Text style={styles.text}>{result}</Text>

      <View style={styles.buttonBlock}>
      <Icon.Button
        name="arrow-alt-circle-left"
        onPress={() => {
          navigation.navigate('SelectAction');
        }}
        backgroundColor="transparent"
        size={50}
        style={styles.leftIcon}
      />
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

  header: {
    fontWeight: 'bold',
    fontSize: 30,
    color: config.colors.primary,
    marginTop: 20,
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
