import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import DrawerNavigation from "../../navigation/DrawerNavigation";
import AnimTab1 from "../../navigation/BottomTabNavigation/bottomTab/AnimTab2";

const Stack = createStackNavigator<any>();

const UserScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"AnimTab1"}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="AnimTab1" component={AnimTab1} />
    </Stack.Navigator>
  );
};

export default UserScreens;
