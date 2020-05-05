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
    keyData: "SGVsbG8gd29ybGQ=",
  },
];

export default function App() {
  const [session, setSession] = React.useState<ExposureSession | null>(null);

  async function runFullExposureDetectionWorkflow() {
    let session: ExposureSession;
    try {
      // Activate session with configuration
      console.log("Running exposure detection workflow...");
      session = await activateSessionAsync(exposureConfiguration);
      console.log(
        "Session activated with configuration:",
        session.configuration
      );

      // Asynchronously add all the keys
      console.log("Adding diagnosis keys...");
      let addedKeysCount = 0;
      while (addedKeysCount < diagnosisKeys.length) {
        const maxKeyCount = await session.getMaximumKeyCountAsync();
        if (!maxKeyCount) {
          // When max-count reached, wait a bit and check again
          await new Promise((resolve) => setTimeout(resolve, 100));
        } else {
          const keysToAdd = diagnosisKeys.slice(
            addedKeysCount,
            Math.min(diagnosisKeys.length, addedKeysCount + maxKeyCount)
          );
          session.addDiagnosisKeysAsync(keysToAdd);
          addedKeysCount += keysToAdd.length;
        }
      }

      // Finish adding all keys
      console.log("Finishing diagnosis keys...");
      const summary = await session?.finishDiagnosisKeysAsync();
      console.log("Exposure summary: ", summary);

      // Retrieve all detected exposured, in batches of
      // 10 exposes per batch.
      let done = false;
      do {
        console.log("Getting exposure info...");
        const exposureInfo = await session.getExposureInfoAsync(10);
        console.log("Detected exposures: ", exposureInfo.exposures);
        done = exposureInfo.done;
      } while (!done);

      // All done
      console.log("Completed exposure detection workflow");
    } catch (err) {
      console.log("ERROR: ", err.message);
      Alert.alert(err.message);
    }
    // @ts-ignore
    session?.invalidateAsync();
  }

  async function _getAuthorizationStatusAsync() {
    try {
      const authorizationStatus = await getAuthorizationStatusAsync();
      Alert.alert(`AuthorizationStatus: ${authorizationStatus}`);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function _activateSessionAsync() {
    try {
      const session = await activateSessionAsync(exposureConfiguration);
      Alert.alert(
        `Session has been activated with configuration: ${JSON.stringify(
          session.configuration,
          undefined,
          2
        )}`
      );
      setSession(session);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function addDiagnosisKeysAsync() {
    try {
      if (!session) throw new Error("No session");
      await session.addDiagnosisKeysAsync(diagnosisKeys);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function getMaximumKeyCountAsync() {
    try {
      if (!session) throw new Error("No session");
      const maxKeyCount = await session.getMaximumKeyCountAsync();
      Alert.alert("Maximum key count available: " + maxKeyCount);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function finishDiagnosisKeysAsync() {
    try {
      if (!session) throw new Error("No session");
      const summary = await session.finishDiagnosisKeysAsync();
      Alert.alert(
        "Finished add keys summary: " + JSON.stringify(summary, undefined, 2)
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function getExposureInfoAsync() {
    try {
      if (!session) throw new Error("No session");
      const { exposures } = await session.getExposureInfoAsync(100);
      Alert.alert("Exposure info: " + JSON.stringify(exposures, undefined, 2));
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function invalidateAsync() {
    try {
      if (!session) throw new Error("No session");
      await session.invalidateAsync();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
    setSession(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.section}>EXPOSURE DETECTION</Text>
      <TouchableOpacity onPress={runFullExposureDetectionWorkflow}>
        <Text>Run full exposure detection workflow</Text>
      </TouchableOpacity>

      <Text style={styles.section}>API CALLS</Text>
      <TouchableOpacity onPress={_getAuthorizationStatusAsync}>
        <Text>getAuthorizationStatusAsync()</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_activateSessionAsync}>
        <Text>activateSessionAsync()</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={addDiagnosisKeysAsync}>
        <Text style={!session && styles.disabled}>
          ExposureSession.addDiagnosisKeysAsync()
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getMaximumKeyCountAsync}>
        <Text style={!session && styles.disabled}>
          ExposureSession.getMaximumKeyCountAsync()
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={finishDiagnosisKeysAsync}>
        <Text style={!session && styles.disabled}>
          ExposureSession.finishDiagnosisKeysAsync()
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getExposureInfoAsync}>
        <Text style={!session && styles.disabled}>
          ExposureSession.getExposureInfoAsync()
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={invalidateAsync}>
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
  section: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "300",
  },
});
