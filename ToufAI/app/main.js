import React from "react";
import {
  SafeAreaView,
  Button, // Add Button for testing
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";


export default function MainScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#2C2C2C" }}>
        {/* Top Status Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            marginBottom: 21,
            marginLeft: 38,
          }}
        >
          <View style={{ alignItems: "center", marginRight: 213 }}>
            <Text
              style={{
                color: "#000000",
                fontSize: 16,
                fontWeight: "bold",
                width: 32,
              }}
            >
              9:52
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
                width: 32,
              }}
            >
              9:52
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/pkf9oma3_expires_30_days.png",
              }}
              resizeMode="stretch"
              style={{ width: 80, height: 17 }}
            />
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/a3p0lvvr_expires_30_days.png",
              }}
              resizeMode="stretch"
              style={{ width: 80, height: 17 }}
            />
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#D9D9D9",
            borderRadius: 36,
            paddingVertical: 5,
            paddingHorizontal: 25,
            marginBottom: 58,
            marginHorizontal: 40,
          }}
          onPress={() => alert("Search pressed!")}
        >
          <Text style={{ color: "#000000", fontSize: 16, flex: 1 }}>
            Search....
          </Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/ufvkhry1_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>

        {/* Tiles Section */}
        {[["Diet", "Style"], ["Haircare", "Hair health"], ["Doctor’s Advice", "Face shape"]].map(
          (pair, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 30,
                marginHorizontal: 30,
              }}
            >
              {pair.map((label, j) => (
                <View
                  key={j}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "#D9D9D9",
                    borderRadius: 26,
                    paddingTop: 80 + j,
                    paddingBottom: 30 + j * 3,
                    marginRight: j === 0 ? 35 : 0,
                  }}
                >
                  <Text style={{ color: "#000000", fontSize: 16 }}>{label}</Text>
                </View>
              ))}
            </View>
          )
        )}

        {/* Test Button for Segmentation (Temporary) */}
        {/* Bottom Nav Bar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#848484",
            paddingVertical: 19,
            paddingLeft: 45,
            paddingRight: 34,
          }}
        >
          {["d6o32ihe", "lvc7ixcb", "2imvjcv9", "u4hpo4rr"].map((id, i) => {
            const icon = (
              <Image
                source={{
                  uri: `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/${id}_expires_30_days.png`,
                }}
                resizeMode="stretch"
                style={{ width: 40 - (i === 0 ? 6 : 0), height: 40 }}
              />
            );

            // Navigate on second icon press
            return i === 1 ? (
              <TouchableOpacity key={i} onPress={() => router.push("/camera")}>
                {icon}
              </TouchableOpacity>
            ) : (
              <View key={i}>{icon}</View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
