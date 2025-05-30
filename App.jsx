import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import React from "react";
import { LogBox } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import theme from "./utils/theme";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./VideoRedux";

registerTranslation("en", en);
export const queryClient = new QueryClient();

LogBox.ignoreAllLogs();

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary, // Change the primary color here
    accent: theme.colors.greyText, // Change the accent color here
    primaryContainer: theme.colors.primaryExtraLight,
    secondaryContainer: theme.colors.extraHard,
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
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
}
