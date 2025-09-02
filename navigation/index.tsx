import { createNavigationContainerRef, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../Screens/SplashScreen";
import UserScreens from "../Screens/UserScreens";
import { navigationComponents } from "./Components";
import React, { useEffect } from "react";
import theme from "../utils/theme";

const Stack = createStackNavigator<any>();

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
  },
};

export const navigationRef = createNavigationContainerRef();

export function navigateAndReset(name: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name }],
    });
  }
}

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={navigationComponents.cardStyle}>
      {/* <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name="UserScreens"
        component={UserScreens}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
