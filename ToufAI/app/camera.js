import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CustomCamera({ navigation }) {
  const simulatePhoto = () => {
    const photoUri = Image.resolveAssetSource(require('')).uri;
    navigation.navigate('Preview', { photoUri });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>
          Simulated Camera
        </Text>
        <TouchableOpacity onPress={simulatePhoto} style={styles.shutter}>
          <Feather name="camera" size={30} color="black" />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
