import React, {useState, useRef, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {View, Text, StyleSheet, Alert, Dimensions} from 'react-native';
import Torch from 'react-native-torch';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CountDownBlink from './components/CountDownBlink';

import ResizableRectangle from '../../components/ResizeableRectangle';
import AppPermissions from '../../utils/AppPermissions';
import config from '../../config';

export default function ECGCapture({navigation}) {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const [shouldContinue, setShouldContinue] = useState(true);
  const [cameraTorchState, setCameraTorchState] = useState(
    RNCamera.Constants.FlashMode.off,
  );
  const [innerRect, setInnerRect] = useState({});
  const [limitingRect, setLimitingRect] = useState({});

  useEffect(() => {
    if (shouldContinue && video) {
      navigation.navigate('Preview', {
        rect: calcRectPixels(video.width, video.height),
        video,
      });
    }

    setVideo(null);
    setShouldContinue(true);
  }, [video]);

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

    setCameraTorchState(RNCamera.Constants.FlashMode.torch);
    setIsRecording(true);

    cameraRef.current
      .recordAsync({
        quality: RNCamera.Constants.VideoQuality['1080p'],
        maxDuration: config.consts.videoDuration,
        mute: true,
      })
      .then((recordedVideo) => {
        setIsRecording(false);
        Torch.switchState(false);
        setVideo(recordedVideo);
      });
  };

  const cancelVideoRecord = () => {
    setShouldContinue(false);
    stopVideoRecord();
  };

  const stopVideoRecord = () => {
    cameraRef.current.stopRecording();
  };

  const handleCameraLoad = (event) => {
    const innerOffset = 100;
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setLimitingRect({
        x: x,
        y: y,
        height: height - innerOffset,
        width: width - innerOffset,
      });
    });
  };

  const calcRectPixels = (imageWidth, imageHeight) => {
    // this is to support the requested ratio (while there are no width/height values from recorded videos)
    imageWidth = 1080;
    imageHeight = 1920;

    const xRatio = innerRect.x / Dimensions.get('window').width;
    let originX = imageWidth * xRatio;

    const widthRatio = innerRect.width / Dimensions.get('window').width;
    let width = imageWidth * widthRatio;

    const yRatio = innerRect.y / Dimensions.get('window').height;
    let originY = (imageHeight + 100) * yRatio;

    const heightRatio = innerRect.height / Dimensions.get('window').height;
    let height = imageHeight * heightRatio;

    return {
      originX: originY,
      originY: originX,
      width: width,
      height: height,
    };
  };

  const goToSelect = () => {
    navigation.navigate('SelectAction');
  };

  return (
    <View style={styles.container} onLayout={handleCameraLoad}>
      <RNCamera
        flashMode={cameraTorchState}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        ratio="16:9"
        type={RNCamera.Constants.Type.back}
        zoom={0}
        ref={cameraRef}
        style={styles.camera}>
        <View style={styles.overlayWrapper}>
          <Text style={styles.leftSide}>
            This is the left side of the ECG plot
          </Text>

          <ResizableRectangle rect={innerRect} setRect={setInnerRect} limitingRect={limitingRect} />
        </View>
        <View style={styles.actionsWrapper}>
          {isRecording ? (
            <>
              <CountDownBlink
                style={styles.countDownBlink}
                seconds={config.consts.videoDuration}
                countDownColor={config.colors.secondary}
              />
              <View style={styles.buttonsWrapper}>
                <Icon.Button
                  name="video-slash"
                  onPress={cancelVideoRecord}
                  backgroundColor="transparent"
                  size={55}
                  style={styles.leftIcon}
                />
                <Icon.Button
                  name="stop-circle"
                  onPress={stopVideoRecord}
                  backgroundColor="transparent"
                  size={65}
                  style={styles.middleIcon}
                />
              </View>
            </>
          ) : (
            <View style={styles.buttonsWrapper}>
              <Icon.Button
                name="arrow-alt-circle-left"
                onPress={goToSelect}
                backgroundColor="transparent"
                size={50}
                style={styles.leftIcon}
              />
              <Icon.Button
                name="video"
                onPress={recordVideo}
                color={config.colors.primary}
                backgroundColor="transparent"
                size={50}
                style={styles.middleIcon}
              />
            </View>
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
  },

  actionsWrapper: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end',
    width: 100,
    alignSelf: 'center',
  },

  leftSide: {
    top: 50,
    position: 'absolute',
    alignSelf: 'center',
    color: config.colors.secondary,
    backgroundColor: config.colors.primary,
  },

  middleIcon: {
    alignSelf: 'center',
  },

  buttonsWrapper: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  countDownBlink: {
    alignSelf: 'center',
  },
});
