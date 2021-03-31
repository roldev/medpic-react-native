import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {Video} from 'expo-av';
import 'react-native-get-random-values'; // must come before uuid
import {v4 as uuidv4} from 'uuid';

import DiagnosisPicker from './components/DiagnosisPicker';
import SendingAnimation from './components/SendingAnimation';

import UserData, {USER_ID_KEY} from '../../store/UserData';
import config from '../../config';

export default function Preview({route, navigation}) {
  if (!route.params.video) {
    return <Text>No video supplied</Text>;
  }

  const [video, setVideo] = useState(route.params.video);

  const [selectedDiag, setSelectedDiag] = useState([]);
  const [customDiag, setCustomDiag] = useState(null);

  const [isSending, setIsSending] = useState(false);

  const [abortController] = useState(new AbortController());

  const cancelSend = () => {
    abortController.abort();
    setIsSending(false);
  };

  const send = async () => {
    setIsSending(true);

    const filename = uuidv4() + '.mp4';

    const userStoreAccess = new UserData();
    const userData = await userStoreAccess.getData();

    const formData = new FormData();

    if (video) {
      formData.append('video', {
        uri: video.uri,
        name: filename,
        type: 'video/mp4',
      });
    }

    formData.append('filename', filename);
    formData.append(
      'requestDataForAnalyze',
      JSON.stringify({
        userId: userData[USER_ID_KEY],
        filename: filename,
        selectedDiags: selectedDiag.join(','),
        customDiag: customDiag,
        angle: 0,
        overlay: rect,
      }),
    );

    fetch(`${config.urls.baseUrl}${config.urls.paths.uploadimage}`, {
      method: 'POST',
      body: formData,
      signal: abortController.signal,
    })
      .then((res) => {
        if (!res.ok) {
          console.error({
            status: res.status,
            headers: res.headers,
          });

          const alertHeader = 'There was an error sending';
          Alert.alert(alertHeader, '', [
            {
              text: 'OK',
              onPress: () => {},
            },
          ]);

          return;
        }

        setVideo(null);
        setSelectedDiag([]);
        setCustomDiag(null);

        res
          .json()
          .then((res) => {
            const diagnosisMessage =
              'diagnosis' in res
                ? res.diagnosis
                : 'No suggested diagnosis was returned';

            const alertHeader = 'Video Sent Successfully';
            const alertMsg = `Diagnsis: ${diagnosisMessage}`;

            Alert.alert(alertHeader, alertMsg, [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('SelectAction');
                },
              },
            ]);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorHeader =
          error.name === 'AbortError'
            ? 'Sending canceled'
            : 'There was an error sending';
        Alert.alert(errorHeader, '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('SelectAction');
            },
          },
        ]);
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return !isSending ? (
    <View style={styles.container}>
      <View style={styles.previewWrapper}>        
        <View style={styles.videoWrapper}>
          <Video
            source={video}
            rate={1.0}
            isMuted={true}
            resizeMode="contain"
            shouldPlay={true}
            isLooping={true}
            style={styles.video}
          />
        </View>
        <DiagnosisPicker
          selectedDiag={selectedDiag}
          setSelectedDiag={setSelectedDiag}
          customDiag={customDiag}
          setCustomDiag={setCustomDiag}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={send} style={[styles.button, styles.send]}>
            <Text style={styles.sendText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.previewWrapper}>
        <SendingAnimation
          ringColor={config.colors.primary}
          ballColor={config.colors.primary}
        />
        <Text style={styles.sendingText}>Sending...</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={cancelSend}
          style={[styles.button, styles.cancelSend]}>
          <Text style={styles.cancelSendText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  previewWrapper: {
    flex: 1,
    backgroundColor: config.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  videoWrapper: {
    flex: 1,
    height: '70%',
    width: '70%',
    position: 'absolute',
    zIndex: 1,
  },

  video: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },

  buttonsContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    top: 0,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    height: 50,
    zIndex: 15,
  },

  send: {
    backgroundColor: config.colors.primary,
  },

  sendText: {
    color: 'white',
  },

  cancelSend: {
    backgroundColor: 'white',
  },

  cancelSendText: {
    color: 'black',
  },

  input: {
    width: '50%',
    justifyContent: 'center',
    backgroundColor: config.colors.inputBG,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    zIndex: 15,
  },

  inputText: {
    height: 50,
    color: 'white',
  },

  leftSide: {
    position: 'absolute',
    color: config.colors.secondary,
    backgroundColor: config.colors.primary,
    top: 100,
    alignSelf: 'center',
    zIndex: 5,
  },

  sendingText: {
    top: 50,
    fontSize: 30,
    color: config.colors.primary,
  },
});
