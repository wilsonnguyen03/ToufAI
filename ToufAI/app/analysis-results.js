
import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const AnalysisResultsScreen = () => {
  const { results } = useLocalSearchParams();
  const analysisData = JSON.parse(results);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Analysis Results</Text>
        {Object.entries(analysisData).map(([key, value]) => (
          <View key={key} style={styles.resultItem}>
            <Text style={styles.resultKey}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
            <Text style={styles.resultValue}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisResultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  resultItem: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultKey: {
    fontSize: 18,
    color: "#A9A9A9",
  },
  resultValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
