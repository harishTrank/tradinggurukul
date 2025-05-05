// components/CustomDrawerContent.tsx (or your chosen path)

import React from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../utils/theme"; // Adjust path
import DrUserHead from "../../Screens/Components/DrUserHead";

const drawerItems = [
  { label: "Home", iconName: "home", navigateTo: "Home" },
  { label: "My Courses", iconName: "book-open", navigateTo: "MyCourses" },
  { label: "Blog", iconName: "edit-3", navigateTo: "Blog" },
  { label: "About Us", iconName: "info", navigateTo: "AboutUs" },
  { label: "Privacy Policy", iconName: "shield", navigateTo: "PrivacyPolicy" },
  { label: "Terms & Condition", iconName: "file-text", navigateTo: "Terms" },
  { label: "Logout", iconName: "log-out", isLogout: true },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { navigation, state } = props;
  const focusedRouteKey = state.routes[state.index]?.key;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          console.log("Logging out...");
          navigation.closeDrawer();
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }], // Navigate to Login after logout
          });
        },
      },
    ]);
  };

  return (
    <>
      <DrUserHead />
      <SafeAreaView style={styles.safeArea}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.itemListContainer}>
            {drawerItems.map((item, index) => {
              const isFocused =
                state.routes.find((route) => route.name === item.navigateTo)
                  ?.key === focusedRouteKey;

              return (
                <DrawerItem
                  key={index}
                  label={item.label}
                  labelStyle={styles.labelStyle}
                  style={[
                    styles.drawerItemStyle,
                    item.isLogout ? styles.logoutItem : {},
                  ]}
                  icon={({ color, size }) => (
                    <Feather
                      name={item.iconName as any}
                      size={20}
                      color={color}
                    />
                  )}
                  focused={isFocused && !item.isLogout}
                  activeTintColor={theme.colors.primary}
                  inactiveTintColor={theme.colors.black}
                  activeBackgroundColor={"rgba(111, 207, 151, 0.1)"}
                  onPress={() => {
                    if (item.isLogout) {
                      handleLogout();
                    } else if (item.navigateTo) {
                      navigation.navigate(item.navigateTo);
                      navigation.closeDrawer();
                    }
                  }}
                />
              );
            })}
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  drawerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
  },
  scrollViewContent: {
    paddingTop: 10,
  },
  itemListContainer: {},
  drawerItemStyle: {
    marginVertical: 5,
  },
  labelStyle: {
    fontSize: 16,
    ...theme.font.fontMedium,
  },
  logoutItem: {},
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGrey,
  },
});
