import messaging from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid } from "react-native";

export async function getFcmToken() {
  let token = null;

  try {
    // iOS: Request notification permissions
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log("iOS Notification permission denied");
        return null;
      }

      // ✅ Wait for APNs token to be generated
      const apnsToken = await messaging().getAPNSToken();
      if (!apnsToken) {
        console.error("APNs token not generated yet");
        return null;
      }
      console.log("APNs Token:", apnsToken);
    }

    // Android: Request POST_NOTIFICATIONS permission (Android 13+)
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Android Notification permission denied");
        return null;
      }
    }

    // Finally, get the FCM token
    token = await messaging().getToken();
    console.log("FCM Device Token:", token);
  } catch (err) {
    console.error("Error getting FCM token", err);
  }

  return token;
}
