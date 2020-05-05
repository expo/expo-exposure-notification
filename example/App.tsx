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

// Taken from:
// https://developer.apple.com/documentation/exposurenotification/building_an_app_to_notify_users_of_covid-19_exposure?language=objc
const exposureConfiguration: ExposureConfiguration = {
  minimumRiskScore: 0,
  attenuationScores: [1, 2, 3, 4, 5, 6, 7, 8],
  attenuationWeight: 50,
  daysSinceLastExposureScores: [1, 2, 3, 4, 5, 6, 7, 8],
  daysSinceLastExposureWeight: 50,
  durationScores: [1, 2, 3, 4, 5, 6, 7, 8],
  durationWeight: 50,
  transmissionRiskScores: [1, 2, 3, 4, 5, 6, 7, 8],
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
