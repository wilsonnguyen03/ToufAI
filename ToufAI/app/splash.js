import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from 'expo-router';
import LocalLogo from "../assets/images/logo.png"; // Local logo image

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        {/* Logo */}
        <Image
          source={LocalLogo}
          resizeMode="contain"
          style={styles.logo}
        />

        {/* Description */}
        <Text style={styles.description}>
          Take control of your hair health with our smart app for women and men. Track
          progress, get personalized diagnoses, and monitor balding with precision. With 60%
          of adults facing hair issues by 35, it’s time to grow with confidence.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <ImageBackground
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/it7zp0kf_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.getStartedBtn}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2C",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.08,
  },
  logo: {
    width: 330,
    height: 100,
    alignSelf: "flex-start"
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "left",
    alignSelf: "stretch",
    marginBottom: 50
  },
  getStartedBtn: {
    alignItems: "center",
    paddingVertical: 19,
    paddingHorizontal: 40,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
