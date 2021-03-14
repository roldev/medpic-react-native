import React, {useState, useRef} from 'react';
import {RNCamera} from 'react-native-camera';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Torch from 'react-native-torch';
import {FontAwesome} from '@expo/vector-icons';

import CountDownBlink from './components/CountDownBlink';

import AppPermissions from '../../utils/AppPermissions';
import config from '../../config';

export default function ECGCapture({navigation}) {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const recordVideo = () => {
    const appPermissions = new AppPermissions();
    const audioRecordingPermission = appPermissions.getAudioRecordingPermission();
    if (!audioRecordingPermission) {
      Alert.alert(
        'Please enable Audio Recording to record Video',
        'Although we record muted video, the permission is required',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
      );

      return;
    }

    setIsRecording(true);

    cameraRef.current
      .recordAsync({
        quality: RNCamera.Constants.VideoQuality['2160p'],
        maxDuration: 10,
        mute: true,
      })
      .then((video) => {
        setIsRecording(false);
        Torch.switchState(false);
        navigation.navigate('Preview', {
          video,
        });
      });
  };

  const stopVideoRecord = () => {
    cameraRef.current.stopRecording();
  };

  return (
    <View style={styles.container}>
      <RNCamera
        flashMode={RNCamera.Constants.FlashMode.torch}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        type={RNCamera.Constants.Type.back}
        ratio={'16:9'}
        zoom={0}
        ref={cameraRef}
        style={styles.camera}>
        <View style={styles.overlayWrapper}>
          <Text style={styles.leftSide}>
            This is the left side of the ECG plot
          </Text>

          {isRecording ? (
            <>
              <CountDownBlink
                seconds={10}
                countDownColor={config.colors.secondary}
              />
              <FontAwesome.Button
                name="stop-circle"
                onPress={stopVideoRecord}
                backgroundColor="transparent"
                size={60}
                style={styles.fontAwesome}
              />
            </>
          ) : (
            <FontAwesome.Button
              name="video-camera"
              onPress={recordVideo}
              backgroundColor="transparent"
              size={50}
              style={styles.fontAwesome}
            />
          )}
        </View>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },

  overlayWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  leftSide: {
    top: 50,
    position: 'absolute',
    alignSelf: 'center',
    color: config.colors.secondary,
    backgroundColor: config.colors.primary,
  },

  fontAwesome: {
    marginRight: -10,
  },
});
