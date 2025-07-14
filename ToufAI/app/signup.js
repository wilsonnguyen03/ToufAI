import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>

        {/* Title & Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.appTitle}>ToufAI</Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/k8b8fnaa_expires_30_days.png",
            }}
            style={styles.logoImage}
            resizeMode="stretch"
          />
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={() => router.push("/login")}>
        <ImageBackground
            source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/7pldxcrg_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.signupBtn}
        >
            <Text style={styles.signupText}>Sign up</Text>
        </ImageBackground>
        </TouchableOpacity>


        {/* Go back to login */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>Already have an account? Sign in</Text>
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
  scroll: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 30,
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
    marginBottom: 30,
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
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F1EFEF",
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 26,
    color: "#000",
    fontSize: 15,
    marginBottom: 10,
  },
  signupBtn: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  signupText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#FFFFFF",
    fontSize: 13,
    textAlign: "center",
  },
});
