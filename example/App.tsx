import {
  sampleMethod,
  getAuthorizationStatusAsync,
  activateAsync,
  ExposureSession,
} from "expo-exposure-notification";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

export default function App() {
  const [session, setSession] = React.useState<ExposureSession | null>(null);

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

      <TouchableOpacity
        onPress={async () => {
          try {
            const session = await activateAsync();
            setSession(session);
          } catch (err) {
            Alert.alert(err.message);
          }
        }}
      >
        <Text>activateAsync()</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!session}
        onPress={async () => {
          try {
            await session?.invalidateAsync();
          } catch (err) {
            Alert.alert(err.message);
          }
          setSession(null);
        }}
      >
        <Text style={!session && styles.disabled}>
          ExposureSession.invalidateAsync()
        </Text>
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
  disabled: {
    color: "#999999",
  },
});
