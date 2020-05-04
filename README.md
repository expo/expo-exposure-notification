# expo-exposure-notification

Expo module and test app for the Apple / Google Exposure Notification (fka Contact Tracing) APIs


## 🤔 Why?

Apple and Google are working together on a standard Exposure Notification API that will across iOS and Android. The API will uses Bluetooth Low Energy (BLE) to implement a technique called contact tracing to track the spread of COVID-19 via approved apps from governments and health organizations.

Developers have used Expo to build a number of COVID-19 symptom trackers because of the speed of deployment possible with Expo, so we want to make the E

### 🚫 Restrictions on App Approval

Apple and Google have indicated that they will only approve apps using this API if they are submitted by established governments and public health organizations.

If you want to invest time building an Exposure Notification app, you will need to find a public health organization or government to partner with.

## 👷‍♀️Status

This version of the Expo Exposure Notification API only supports iOS. The Android spec is available but we do not believe it is publicly available to developers yet. Please let us know if that

It is posisble that this API will change some in future versions, in particular, to support iOS and Android more fully.

## 📱API

### 📙 Example Usage

Check out the [Example App](https://github.com/expo/expo-exposure-notification/tree/master/example) for more detail.

```ts
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

```

## 🚀 Development 

First of, make sure you have XCode 11.5 [(beta)](https://developer.apple.com/support/beta-software/) installed. 

Running `yarn build` will continuously build the TypeScript code in `./src` into `./build`.

To run the package in the `./example` app use:

```sh
cd example
yarn
cd ios && pod install && cd ..
yarn ios
```

After installing the example-app dependencies and running `pod install`, you can also open the example
app in XCode for development and debugging purposes.

```sh
yarn debug:ios
```

After adding or removing files to the `./ios` folder, you need to run `pod install` in the example-app.

