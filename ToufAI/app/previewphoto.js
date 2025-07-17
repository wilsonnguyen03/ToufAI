import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PreviewPhoto() {
  const navigation = useNavigation();
  const staticImage = require('../assets/images/wilson2.jpg');

  return (
    <View style={styles.container}>
      {/* 🔝 Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('main')}
      >
        <Text style={styles.homeText}>🏠 Home</Text>
      </TouchableOpacity>

      {/* 📸 Preview Image */}
      <Image source={staticImage} style={styles.image} resizeMode="contain" />

      {/* 🎯 Circle Overlay */}
      <View style={styles.centerCircleOverlay} />

      {/* ⬅️ ➡️ Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('camera')}
        >
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('camera2')}
        >
          <Text style={styles.text}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { flex: 1, width: '100%' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#000',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#f44336',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 100,
  },
  homeText: {
    fontSize: 14,
    color: '#000',
  },
  centerCircleOverlay: {
    position: 'absolute',
    top: '38%',
    left: '34%',
    width: 400,
    height: 500,
    borderRadius: 200,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -135 }, { translateY: -145 }],
    zIndex: 5,
  },
});
