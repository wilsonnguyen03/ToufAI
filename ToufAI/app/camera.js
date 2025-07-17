import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomCamera2() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const navigation = useNavigation();
  const [showInstruction, setShowInstruction] = useState(true);
  const overlayImage = require('../assets/images/camera1.png');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>No camera access. Please allow permissions.</Text>
      </View>
    );
  }

  const takePhoto = () => {
    navigation.navigate('previewphoto2');
  };

  const pickImageFromAlbum = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Preview', {
        photoUri: result.assets[0].uri,
        isLocal: false,
      });
    }
  };

  const toggleCamera = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowInstruction(false)}>
      <View style={{ flex: 1 }}>
        {/* ───── Home Button ───── */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('progression')}
        >
          <Text style={styles.homeText}>🏠 Home</Text>
        </TouchableOpacity>

        {/* ───── Camera View ───── */}
        <CameraView style={{ flex: 1 }} facing={facing} />

        {/* ───── Center Circle Overlay ───── */}
        {!showInstruction && <View style={styles.centerCircleOverlay} />}

        {/* ───── Instruction Overlay ───── */}
        {showInstruction && (
          <View style={styles.overlayWrapper}>
            <View style={styles.speechBubble}>
              <Text style={styles.overlayText}>
                Please fit the top of your head in the oval and take a photo.{' '}
                <Text style={styles.italicText}>Tap to proceed</Text>
              </Text>
              <View style={styles.speechTail} />
            </View>
            <Image source={overlayImage} style={styles.overlayImage} />
          </View>
        )}

        {/* ───── Controls ───── */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={toggleCamera} style={styles.switchButton}>
            <Feather name="refresh-cw" size={28} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto} style={styles.shutterButton}>
            <Feather name="camera" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImageFromAlbum} style={styles.albumButton}>
            <Feather name="image" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#ffffffaa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  homeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  switchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4682B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayWrapper: {
    position: 'absolute',
    bottom: 140,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    maxWidth: 220,
    marginRight: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlayText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  speechTail: {
    position: 'absolute',
    right: -6,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
  overlayImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  centerCircleOverlay: {
    position: 'absolute',
    top: '45%',
    left: '34%',
    width: 400,
    height: 450,
    borderRadius: 200,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -135 }, { translateY: -145 }],
    zIndex: 5,
  },
  italicText: {
    fontStyle: 'italic',
    color: '#ccc',
  },
});
