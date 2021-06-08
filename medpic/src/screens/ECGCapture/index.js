import React, {useState, useRef, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Torch from 'react-native-torch';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused} from '@react-navigation/native';

import CountDownBlink from './components/CountDownBlink';

import ResizableRectangle from '../../components/ResizeableRectangle';
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
  const [cameraSize, setCameraSize] = useState({});
  const isFocused = useIsFocused();
  const [captureRect, setCaptureRect] = useState(false);

  useEffect(() => {
    const {width, height} = Dimensions.get('window');
    const innerOffset = 100;
    const cameraHeight = width * 1.77;
    const yCoord = (height - cameraHeight) / 2;

    setCameraSize({
      width: width,
      height: cameraHeight,
    });

    setLimitingRect({
      x: 0,
      y: yCoord + 15,
      height: cameraHeight - innerOffset,
      width: width - innerOffset,
    });
  }, []);

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
    setCameraTorchState(RNCamera.Constants.FlashMode.torch);
    setIsRecording(true);

    setCaptureRect(true);

    cameraRef.current
      .recordAsync({
        quality: RNCamera.Constants.VideoQuality['1080p'],
        maxDuration: config.consts.videoDuration,
        mute: true,
        orientation: 'portrait',
      })
      .then((recordedVideo) => {
        setIsRecording(false);
        setVideo(recordedVideo);

        Torch.switchState(false);
      });
  };

  const cancelVideoRecord = () => {
    setShouldContinue(false);
    stopVideoRecord();
  };

  const stopVideoRecord = () => {
    cameraRef.current.stopRecording();
  };

  const calcRectPixels = (imageWidth, imageHeight) => {
    // this is to support the requested ratio (while there are no width/height values from recorded videos)
    imageWidth = 1080;
    imageHeight = 1920;

    const xRatio = innerRect.x / cameraSize.width;
    let originX = imageWidth * xRatio;

    const widthRatio = innerRect.width / cameraSize.width;
    let width = imageWidth * widthRatio;

    const yRatio = innerRect.y / cameraSize.height;
    let originY = imageHeight * yRatio;

    const heightRatio = innerRect.height / cameraSize.height;
    let height = imageHeight * heightRatio;

    const yOffset = 100;
    const rectPixels = {
      originX: originY - yOffset,
      originY: originX,
      width: height,
      height: width,
    };

    return rectPixels;
  };

  const goToSelect = () => {
    navigation.navigate('SelectAction');
  };

  const styles = stylesBuilder({cameraSize});

  if (!isFocused) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.leftSide}>This is the left side of the ECG plot</Text>
      <RNCamera
        flashMode={cameraTorchState}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        ratio="16:9"
        type={RNCamera.Constants.Type.back}
        zoom={0}
        ref={cameraRef}
        style={styles.camera}
      />
      <View style={styles.resizableRectangleWrapper}>
        <View style={styles.testWrapper}>
          <ResizableRectangle
            rect={innerRect}
            setRect={setInnerRect}
            limitingRect={limitingRect}
            shouldCaptureRect={captureRect}
          />
        </View>
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
    </View>
  );
}

function stylesBuilder({cameraSize}) {
  return {
    container: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: config.colors.secondary,
      flex: 1,
    },

    camera: {
      width: cameraSize.width,
      height: cameraSize.height,
    },

    resizableRectangleWrapper: {
      position: 'absolute',
      flex: 1,
      top: 0,
    },

    testWrapper: {
      flexDirection: 'column',
      justifyContent: 'space-around',
    },

    actionsWrapper: {
      bottom: 50,
      position: 'absolute',
      alignSelf: 'center',
      color: config.colors.secondary,
      backgroundColor: 'transparent',
    },

    leftSide: {
      top: 50,
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 10,
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
  };
}
