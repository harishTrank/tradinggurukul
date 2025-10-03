import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../Screens/UserScreens/HomeScreen";
import theme from "../../utils/theme";
import AnimTab1 from "../BottomTabNavigation/bottomTab/AnimTab2";
import { CustomDrawerContent } from "./CustomDrawerContent";
import BlogScreen from "../../Screens/UserScreens/BlogScreen";
import AllCoursesScreen from "../../Screens/UserScreens/AllCoursesScreen";
import AboutUsScreen from "../../Screens/UserScreens/AboutUsScreen";
import PrivacyPolicyScreen from "../../Screens/UserScreens/PrivacyPolicyScreen";
import TermsAndConditionScreen from "../../Screens/UserScreens/TermsAndConditionScreen";
import RefundScreen from "../../Screens/UserScreens/RefundScreen";
import SupportScreen from "../../Screens/UserScreens/SupportScreen";
import ReferAndEarnScreen from "../../Screens/UserScreens/ReferAndEarnScreen";
import EventScreen from "../../Screens/UserScreens/EventScreen";
import MyCoursesScreen from "../../Screens/UserScreens/MyCoursesScreen";
import IPOScreen from "../../Screens/UserScreens/IPOScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "left",
        headerShown: false,
        drawerType: "back",
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: "#FFF0D4",
        drawerInactiveTintColor: theme.colors.secondaryLight,
        swipeEdgeWidth: 0,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 300,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={AnimTab1} />
      <Drawer.Screen name="AllCourses" component={AllCoursesScreen} />
      <Drawer.Screen name="MyCourses" component={MyCoursesScreen} />
      <Drawer.Screen name="Blog" component={BlogScreen} />
      <Drawer.Screen name="Events" component={EventScreen} />
      <Drawer.Screen name="IPOScreen" component={IPOScreen} />
      <Drawer.Screen name="ReferAndEarnScreen" component={ReferAndEarnScreen} />
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Drawer.Screen name="RefundScreen" component={RefundScreen} />
      <Drawer.Screen name="Terms" component={TermsAndConditionScreen} />
      <Drawer.Screen name="SupportScreen" component={SupportScreen} />
    </Drawer.Navigator>
  );
}
