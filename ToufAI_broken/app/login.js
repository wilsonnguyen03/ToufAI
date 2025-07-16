import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const [textInput1, onChangeTextInput1] = useState('');
  const [textInput2, onChangeTextInput2] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status Bar Mock */}
        <View style={styles.topBar}>
          <Text style={styles.timeText}>9:52</Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/jlj4erog_expires_30_days.png"
            }}
            resizeMode="stretch"
            style={styles.topIcon}
          />
        </View>

        {/* Title & Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.appTitle}>ToufAI</Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/n8p8icae_expires_30_days.png"
            }}
            resizeMode="stretch"
            style={styles.logoImage}
          />
        </View>

        {/* Guest Sign-In */}
        <TouchableOpacity onPress={() => router.push("/main")}>
          <ImageBackground
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/lshdivwl_expires_30_days.png"
            }}
            resizeMode="stretch"
            style={styles.guestBtn}
          >
            <Text style={styles.guestText}>Guest Sign in</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* Login Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.orText}>OR</Text>

          <TextInput
            placeholder="Enter your email / username"
            placeholderTextColor="#888"
            value={textInput1}
            onChangeText={onChangeTextInput1}
            style={styles.input}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#888"
              value={textInput2}
              onChangeText={onChangeTextInput2}
              secureTextEntry
              style={styles.passwordInput}
            />
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/pj0miqw5_expires_30_days.png"
              }}
              resizeMode="stretch"
              style={styles.eyeIcon}
            />
          </View>

          {/* Forgot Password */}
          <Text style={styles.forgotPassword}>Forgot password</Text>

          {/* Login Button */}
          <TouchableOpacity onPress={() => router.push("/main")}>
            <ImageBackground
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/75tnhb2g_expires_30_days.png"
              }}
              resizeMode="stretch"
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>Login</Text>
            </ImageBackground>
          </TouchableOpacity>

          {/* Sign Up */}
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupText}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2C",
  },
  scroll: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 60,
    paddingHorizontal: 10,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  topIcon: {
    width: 80,
    height: 17,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 38,
  },
  appTitle: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 12,
  },
  logoImage: {
    width: 46,
    height: 46,
  },
  guestBtn: {
    alignItems: "center",
    paddingVertical: 19,
    marginBottom: 29,
  },
  guestText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    alignItems: "center",
  },
  orText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 36,
  },
  input: {
    width: "100%",
    backgroundColor: "#F1EFEF",
    color: "#000000",
    fontSize: 15,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 26,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1EFEF",
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: "100%",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    color: "#000000",
    fontSize: 15,
    paddingLeft: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    color: "#FFB300",
    fontSize: 13,
    marginBottom: 20,
  },
  loginBtn: {
    alignItems: "center",
    paddingVertical: 19,
    marginBottom: 20,
    width: "100%",
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  signupText: {
    color: "#FFFFFF",
    fontSize: 13,
    textAlign: "center",
  },
});
