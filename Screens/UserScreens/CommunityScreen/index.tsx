import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CommunityMainScreen from "./CommunityMainScreen";
import CommunityReadScreen from "./CommunityReadScreen";

const Stack = createStackNavigator<any>();

const CommunityScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"CommunityMainScreen"}
    >
      <Stack.Screen
        name="CommunityMainScreen"
        component={CommunityMainScreen}
      />
      <Stack.Screen
        name="CommunityReadScreen"
        component={CommunityReadScreen}
      />
    </Stack.Navigator>
  );
};

export default CommunityScreen;
