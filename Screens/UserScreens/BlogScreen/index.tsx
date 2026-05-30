import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BlogMainScreen from "./BlogMainScreen";
import BlogReadScreen from "./BlogReadScreen";

const Stack = createStackNavigator<any>();

const BlogScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"BlogMainScreen"}
    >
      <Stack.Screen name="BlogMainScreen" component={BlogMainScreen} />
      <Stack.Screen name="BlogReadScreen" component={BlogReadScreen} />
    </Stack.Navigator>
  );
};

export default BlogScreen;
