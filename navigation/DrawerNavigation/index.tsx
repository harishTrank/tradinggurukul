import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../Screens/UserScreens/HomeScreen";
import theme from "../../utils/theme";
import AnimTab1 from "../BottomTabNavigation/bottomTab/AnimTab2";
import { CustomDrawerContent } from "./CustomDrawerContent";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "left",
        headerShown: false,
        drawerType: "front",
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
      <Drawer.Screen name="Courses" component={HomeScreen} />
      <Drawer.Screen name="Blog" component={HomeScreen} />
      <Drawer.Screen name="AboutUs" component={HomeScreen} />
      <Drawer.Screen name="PrivacyPolicy" component={HomeScreen} />
      <Drawer.Screen name="Terms" component={HomeScreen} />
    </Drawer.Navigator>
  );
}
