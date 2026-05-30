// src/hooks/useSessionManager.js
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkLoginTokenApi } from "../../store/Services/Others";
import { navigateAndReset, navigationRef } from "../../navigation";
import Toast from "react-native-toast-message";

const useSessionManager = () => {
  const appState = useRef(AppState.currentState);

  const handleSessionCheck = async () => {
    const userDetailsString = await AsyncStorage.getItem("userDetail");
    const deviceToken = await AsyncStorage.getItem("device_token");
    const userDetails = userDetailsString
      ? JSON.parse(userDetailsString)
      : null;

    if (!userDetails?.id || !deviceToken) {
      return; // Not logged in
    }
    checkLoginTokenApi({
      body: {
        user_id: userDetails?.id,
        device_token: deviceToken,
      },
    })
      ?.then(async (res: any) => {
        if (res?.status == 0) {
          Toast.show({
            type: "error",
            text1: "Your session has expired.",
            text2: "Please log in again.",
          });
          await AsyncStorage.clear();
          navigateAndReset("LoginScreen");
        }
      })
      ?.catch((err: any) => {
        console.log("Error during session check:", err);
      });
  };

  useEffect(() => {
    // 1️⃣ App comes to foreground
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("🔄 App foreground → checking session");
        handleSessionCheck();
      }
      appState.current = nextAppState;
    });

    // 2️⃣ Navigation state change
    const unsubscribeNav = navigationRef.addListener("state", () => {
      console.log("🔄 Screen changed → checking session");
      handleSessionCheck();
    });

    // 3️⃣ Interval every 5 min
    const interval = setInterval(() => {
      console.log("🔄 Interval → checking session");
      handleSessionCheck();
    }, 5 * 60 * 1000);

    // Initial check
    handleSessionCheck();

    return () => {
      subscription.remove();
      unsubscribeNav();
      clearInterval(interval);
    };
  }, []);
};

export default useSessionManager;
