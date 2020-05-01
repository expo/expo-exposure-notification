import {
  getAuthorizationStatusAsync,
  activateSessionAsync,
  ExposureSession,
  ExposureKey,
  ExposureRiskLevel,
  ExposureConfiguration,
} from "expo-exposure-notification";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

// TODO: Set some proper config here
const exposureConfiguration: ExposureConfiguration = {
  attenuationScores: [0, 0, 0, 0, 0, 0, 0, 0],
  attenuationWeight: 50,
  daysSinceLastExposureScores: [0, 0, 0, 0, 0, 0, 0, 0],
  daysSinceLastExposureWeight: 50,
  durationScores: [0, 0, 0, 0, 0, 0, 0, 0],
  durationWeight: 50,
  transitionRiskScores: [0, 0, 0, 0, 0, 0, 0, 0],
  transmissionRiskWeight: 50,
};

const diagnosisKeys: ExposureKey[] = [
  {
    transmissionRiskLevel: ExposureRiskLevel.LOW,
    rollingStartNumber: 0,
    intervalNumber: 0,
    keyData: new Uint8Array(20),
  },
];

export default function App() {
  const [session, setSession] = React.useState<ExposureSession | null>(null);

  return (
    <View style={styles.container}>
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
            const session = await activateSessionAsync(exposureConfiguration);
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
            await session?.addDiagnosisKeysAsync(diagnosisKeys);
          } catch (err) {
            Alert.alert(err.message);
          }
          setSession(null);
        }}
      >
        <Text style={!session && styles.disabled}>
          ExposureSession.addDiagnosisKeysAsync()
        </Text>
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
