import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get("window");

export default function SplashScreen() {    
const router = useRouter();

return (    
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>9:52</Text>
          </View>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/sovcmwp8_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.icon}
          />
        </View>

        {/* App Title & Description */}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.appTitle}>
              <Text style={{ color: "#FFFFFF" }}>Touf</Text>
              <Text style={{ color: "#FFD700" }}>AI</Text>
            </Text>
            <Text style={styles.description}>
              Take control of your hair health with our smart app for women and men. Track
              progress, get personalized diagnoses, and monitor balding with precision. With 60%
              of adults facing hair issues by 35, it’s time to grow with confidence.
            </Text>
          </View>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/9fph5r4o_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.logo}
          />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity onPress={() => router.push('/login')}>
        <ImageBackground
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/it7zp0kf_expires_30_days.png" }}
            resizeMode="stretch"
            style={styles.getStartedBtn}
        >
            <Text style={styles.getStartedText}>Get Started</Text>
        </ImageBackground>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2C",
  },
  scrollContent: {
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.08,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.25,
    justifyContent: "space-between",
  },
  timeContainer: {
    alignItems: "center",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    width: width * 0.25,
    height: 20,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.1,
  },
  appTitle: {
    fontSize: 0.08 * width,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: "#FFFFFF",
    maxWidth: "100%",
  },
  logo: {
    width: 46,
    height: 46,
    marginLeft: 16,
  },
  getStartedBtn: {
    alignItems: "center",
    paddingVertical: 19,
    marginBottom: 40,
    marginHorizontal: 0,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
