import {
  sampleMethod,
  getAuthorizationStatusAsync,
} from "expo-exposure-notification";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const res = await sampleMethod("covid", 19);
          Alert.alert(res);
        }}
      >
        <Text>call sampleMethod()</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const authorizationStatus = await getAuthorizationStatusAsync();
          Alert.alert(`AuthorizationStatus: ${authorizationStatus}`);
        }}
      >
        <Text>getAuthorizationStatusAsync()</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
