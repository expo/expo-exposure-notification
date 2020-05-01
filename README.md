# expo-exposure-notification
Expo module and test app for the Apple / Google Exposure Notification (aka Contact Tracing) APIs


## Development usage

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