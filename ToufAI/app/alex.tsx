
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header and Search */}
      <Text style={styles.title}>
        Touf<Text style={{ color: '#FFA500' }}>AI</Text> 👨🏽‍🦲
      </Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput placeholder="Search..." placeholderTextColor="#999" style={styles.searchInput} />
      </View>
      
      {/* Grid Buttons */}
      <ScrollView contentContainerStyle={styles.grid}>
        <GridButton icon="shopping-bag" label="Diet" iconColor="green" />
        <GridButton icon="cut" label="Style" />
        <GridButton icon="shower" label="Haircare" />
        <GridButton icon="water" label="Hair health" iconType="MaterialCommunityIcons" iconColor="#4C8CF5" />
        <GridButton icon="user-md" label="Doctor's Advice" iconColor="red" />
        <GridButton icon="face-recognition" label="Face shape" iconType="MaterialCommunityIcons" />
      </ScrollView>

      {/* Bottom Bar Placeholder */}
      <View style={styles.bottomNav}>
        <Ionicons name="search" size={24} color="yellow" />
        <Ionicons name="camera" size={24} color="white" />
        <Ionicons name="ellipsis-horizontal-circle" size={24} color="white" />
        <Ionicons name="settings" size={24} color="white" />
      </View>
    </View>
  );
}

function GridButton({
  icon,
  label,
  iconType = 'FontAwesome5',
  iconColor = '#000',
}: {
  icon: string;
  label: string;
  iconType?: 'FontAwesome5' | 'MaterialCommunityIcons';
  iconColor?: string;
}) {
  const router = useRouter(); // ✅ Add this hook here
  const IconComponent =
    iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome5;

  return (
    <TouchableOpacity
      style={styles.gridButton}
      onPress={() => router.push({ pathname: '/info', params: { topic: label } })} // ✅ Add navigation
    >
      <IconComponent name={icon} size={24} color={iconColor} />
      <Text style={styles.gridLabel}>{label}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridButton: {
    width: '47%',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  gridLabel: {
    marginTop: 10,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
