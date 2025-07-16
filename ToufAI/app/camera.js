// ToufAI/app/camera.js

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, NativeModules, NativeEventEmitter, findNodeHandle, Image, requireNativeComponent } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Get the native component and its manager
const NativeCameraView = requireNativeComponent('CameraView');
const { CameraViewManager } = NativeModules;

// Set up the event emitter
const cameraEventEmitter = new NativeEventEmitter(CameraViewManager);

export default function CustomCamera({ navigation }) {
  const cameraRef = useRef(null);
  let eventListener = useRef(null);

  useEffect(() => {
    // Subscribe to the event from the native side
    eventListener.current = cameraEventEmitter.addListener('onCameraResult', (event) => {
      console.log('Received onCameraResult event:', event);

      if (event.status === 'success') {
        // On success, navigate to the preview screen with the results
        // The analysis results and the base64 mask are passed as route params
        navigation.navigate('Preview', { 
            photoUri: `data:image/jpeg;base64,${event.segmentationMask}`, // Display the mask in preview
            analysisResults: event.analysisResults,
            message: "Analysis successful!"
        });
      } else if (event.status === 'rejected') {
        // Show an alert if the photo was rejected
        Alert.alert('Photo Rejected', event.message || 'Please try again with better lighting and a clearer view of the face and hair.');
      } else {
        // Show a generic error for other failures
        Alert.alert('Error', event.message || 'An unexpected error occurred.');
      }
    });

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      eventListener.current?.remove();
    };
  }, [navigation]); // Add navigation to dependency array as it's used in the effect

  const handleCapture = () => {
    if (cameraRef.current) {
      // Get the unique identifier for the native view
      const nodeHandle = findNodeHandle(cameraRef.current);
      // Call the manager's method with the nodeHandle
      CameraViewManager.capturePhoto(nodeHandle);
    }
  };

  return (
    <View style={styles.container}>
      <NativeCameraView style={styles.cameraView} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCapture} style={styles.shutter}>
          <Feather name="camera" size={40} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraView: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
});
