import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PreviewPhoto2() {
  const navigation = useNavigation();
  const staticImage = require('../assets/images/wilson1.jpg');

  return (
    <View style={styles.container}>
      {/* ───── Home Button ───── */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('main')}
      >
        <Text style={styles.homeText}>🏠 Home</Text>
      </TouchableOpacity>

      {/* ───── Image Preview ───── */}
      <Image source={staticImage} style={styles.image} resizeMode="contain" />

      {/* ───── Circle Overlay ───── */}
      <View style={styles.centerCircleOverlay} />

      {/* ───── Retake / Next Buttons ───── */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('camera2')}
        >
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('progression')}
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

  homeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffffffaa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  homeText: {
    fontSize: 16,
    fontWeight: '600',
  },

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

  // 🎯 Circle Overlay
  centerCircleOverlay: {
    position: 'absolute',
    top: '45%',
    left: '34%',
    width: 400,
    height: 200,
    borderRadius: 200,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -135 }, { translateY: -145 }],
    zIndex: 5,
  },
});
