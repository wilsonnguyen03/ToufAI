import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const logo = require('../assets/images/logo-removebg-preview.png'); // adjust the path if needed

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          {/* ───── Logo ───── */}
          <Image source={logo} style={styles.logo} />

          <Text style={styles.heading}>Settings</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ───── Bottom Nav Bar ───── */}
      <View style={styles.bottomBar}>
        {['d6o32ihe', 'lvc7ixcb', '2imvjcv9', 'u4hpo4rr'].map((id, i) => {
          const isActive = i === 3; // Settings tab is active
          const isWhite = i === 0 || i === 2;

          const icon = (
            <Image
              source={{
                uri: `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/${id}_expires_30_days.png`,
              }}
              resizeMode="stretch"
              style={{
                width: 34,
                height: 34,
                tintColor: isActive ? '#FFD700' : isWhite ? '#FFFFFF' : undefined,
              }}
            />
          );

          const routes = ['/main', '/camera', '/progression', '/setting'];

          return (
            <TouchableOpacity key={i} onPress={() => router.push(routes[i])}>
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#555',
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    paddingVertical: 19,
    paddingLeft: 45,
    paddingRight: 34,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
