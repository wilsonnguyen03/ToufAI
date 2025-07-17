
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';

const previewphoto = () => {
  const router = useRouter();
  const { uri } = useLocalSearchParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Replace with your actual backend URL
      const response = await fetch("http://127.0.0.1:5001/analyze_hair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a successful response from the server.");
      }

      const results = await response.json();
      router.push({
        pathname: "/analysis-results",
        params: { results: JSON.stringify(results) },
      });

    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Analysis Failed", "Could not analyze the photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri }} style={styles.previewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAnalysis} disabled={isAnalyzing}>
          <Text style={styles.buttonText}>{isAnalyzing ? "Analyzing..." : "Analyze Hair"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handleRetake}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default previewphoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 50,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retakeButton: {
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
