# expo-exposure-notification

Expo module and test app for the Apple / Google Exposure Notification (fka Contact Tracing) APIs.

## 👷‍♀️ Status

*⚠️ This module is in development, is pre-release, and is not ready for you to use yet*

- The JavaScript interface into the underlying OS-level Exposure Notification APIs may change in significant ways. 
- Some, but not all, of the iOS API is implemented.
  - Adding session data is implemented
  - Retrieving data is not done
- There is no implementation for Android yet


This version of the Expo Exposure Notification API only supports iOS. The Android spec is available but we do not believe the libraries are publicly available to developers yet. Please let us know if that changes.

It is posisble that this API will change some in future versions, in particular, to support iOS and Android in a more unified way.


## 🤔 Why?

Apple and Google are working together on a standard Exposure Notification API that will across iOS and Android. The API will uses Bluetooth Low Energy (BLE) to implement a technique called contact tracing to track the spread of COVID-19 via approved apps from governments and health organizations.

Developers have used Expo to build a number of COVID-19 symptom trackers because of the speed of deployment possible with Expo, so we are making this library to help Expo developers quickly build apps that use the Exposure Notifications APIs and release them on both iOS and Android as quickly as possible.

### 🚫 Restrictions on App Approval

Apple and Google have indicated that they will only approve apps using this API if they are submitted by established governments and public health organizations.

If you want to invest time building an Exposure Notification app, you will need to find a public health organization or government to partner with.


## Requirements

Right now, you will need the following to run this:

- A Mac
- The latest Xcode Beta (currently 11.5 beta 1). [Get it here](https://xcodereleases.com/).
- An iPhone
- The latest iOS Beta running on your iPhone. [Sign up for the beta program here](https://beta.apple.com/sp/betaprogram/)

## 📱API

The current version of the Exposure Notification spec is 1.2

- [iOS Framework API Specification](https://covid19-static.cdn-apple.com/applications/covid19/current/static/contact-tracing/pdf/ExposureNotification-FrameworkDocumentationv1.2.pdf)
- [Android Framework API Specification](https://www.blog.google/documents/68/Android_Exposure_Notification_API_documentation_v1.2.pdf)

Apps using the Exposure Notification APIs should do the following things:

- Triggers dialogs for user permission flows.
- Let users start and stop broadcasting and scanning.
- Provides temporary tracing keys, key start time number, and key transmission
risk level from your internet-accessible server to the Exposure Notification APIs from Apple/Google.
- Retrieves keys from the on-device data store and submits them to your
internet-accessible server after a user has been confirmed by a medical provider
as having tested positive, and the user has provided permission.
- Shows a notification to the user with instructions on what to do next when the
user has been exposed to another user who has tested positive for COVID-19.
- Provide the ability to delete all collected tracing keys from the on-device
database. This is done by calling into the Exposure Notification APIs.

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

## Contact Us

If you are working on an Exposure Notification app with Expo, please reach out to us by e-mailing [covid19@expo.io](mailto:covid19@expo.io), so we can help you as much as possible.

