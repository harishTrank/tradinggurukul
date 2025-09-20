import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { LogBox, Platform } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import theme from "./utils/theme";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./VideoRedux";
import useSessionManager from "./utils/extra/useSessionManager";
import { userDetailsGlobal } from "./JotaiStore";
import { useAtom } from "jotai";
import messaging from "@react-native-firebase/messaging";
import { getFcmToken } from "./utils/services/firebase";

registerTranslation("en", en);
export const queryClient = new QueryClient();

LogBox.ignoreAllLogs();

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    accent: theme.colors.greyText,
    primaryContainer: theme.colors.primaryExtraLight,
    secondaryContainer: theme.colors.extraHard,
  },
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification (headless task):", remoteMessage);
});

export default function App() {
  const [userDetails] = useAtom(userDetailsGlobal);
  const isLoadingComplete = useCachedResources();

  useSessionManager();

  useEffect(() => {
    getFcmToken();
  }, []);

  if (!isLoadingComplete) return null;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={customTheme}>
            <Navigation />
            <Toast position="top" />
          </PaperProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
