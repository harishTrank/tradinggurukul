import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import DrawerNavigation from "../../navigation/DrawerNavigation";
import BottomTabNavigation from "../../navigation/BottomTabNavigation";
const Stack = createStackNavigator<any>();

const UserScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"BottomTabNavigation"}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
      />
    </Stack.Navigator>
  );
};

export default UserScreens;
