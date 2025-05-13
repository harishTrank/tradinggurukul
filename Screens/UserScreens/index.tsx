import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigation from "../../navigation/DrawerNavigation";
import StartScreen from "./StartScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";
import OTPScreen from "./OTPScreen";
import MyCoursesScreen from "./MyCoursesScreen";
import SearchCourseScreen from "./SearchCourseScreen";
import CartScreen from "./CartScreen";
import EditProfileScreen from "./EditProfileScreen";
import ViewCourseScreen from "./ViewCourseScreen";
import SplashScreen from "../SplashScreen";
import AllCoursesScreen from "./AllCoursesScreen";
import MyCourseViewScreen from "./MyCourseViewScreen/index.jsx";
import PreviewTopicScreen from "./PreviewTopicScreen";

const Stack = createStackNavigator<any>();

const UserScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"SplashScreen"}
    >
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="MyCoursesScreen" component={MyCoursesScreen} />
      <Stack.Screen name="SearchCourseScreen" component={SearchCourseScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ViewCourseScreen" component={ViewCourseScreen} />
      <Stack.Screen name="MyCourseViewScreen" component={MyCourseViewScreen} />
      <Stack.Screen name="PreviewTopicScreen" component={PreviewTopicScreen} />
    </Stack.Navigator>
  );
};

export default UserScreens;
