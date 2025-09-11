// components/CustomDrawerContent.tsx (or your chosen path)

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../utils/theme"; // Adjust path
import DrUserHead from "../../Screens/Components/DrUserHead";
import DrLoginHead from "../../Screens/Components/DrLoginHead";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../JotaiStore";
import { supportDetailsApi } from "../../store/Services/Others"; // Adjust path if necessary

const drawerItems = [
  { label: "Home", iconName: "home", navigateTo: "Home" },
  { label: "All Courses", iconName: "book-open", navigateTo: "AllCourses" },
  { label: "Blog", iconName: "edit-3", navigateTo: "Blog" },
  { label: "Refer & Earn", iconName: "gift", navigateTo: "ReferAndEarnScreen" },
  { label: "About Us", iconName: "info", navigateTo: "AboutUs" },
  { label: "Privacy Policy", iconName: "shield", navigateTo: "PrivacyPolicy" },
  { label: "Refund Policy", iconName: "shield", navigateTo: "RefundScreen" },
  { label: "Terms & Condition", iconName: "file-text", navigateTo: "Terms" },
  { label: "Support", iconName: "headphones", navigateTo: "SupportScreen" },
  { label: "Logout", iconName: "log-out", isLogout: true },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { navigation, state }: any = props;
  const focusedRouteKey = state.routes[state.index]?.key;
  const [isLoginFlag, setIsLoginFlag]: any = useState(false);
  const [, setUserDetails]: any = useAtom(userDetailsGlobal);

  const [socialData, setSocialData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch social media links
    const fetchSupportDetails = () => {
      setIsLoading(true);
      supportDetailsApi()
        ?.then((res: any) => {
          if (res?.social_media) {
            const links = Object.entries(res.social_media)
              .filter(([, value]: [string, any]) => value.url)
              .map(([key, value]: [string, any]) => ({
                platform: key,
                ...value,
              }));
            setSocialData(links);
          }
        })
        .catch((err) =>
          console.error("Error fetching social media details:", err)
        )
        .finally(() => setIsLoading(false));
    };

    fetchSupportDetails();

    // Listener for login status
    const focusListener = navigation.addListener("focus", () => {
      loginFlagManager();
    });

    return focusListener;
  }, [navigation]);

  const loginFlagManager = async () => {
    const loginFlagChecker = await AsyncStorage.getItem("loginFlag");
    setIsLoginFlag(loginFlagChecker === "true");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.clear();
          setUserDetails({});
          navigation.closeDrawer();
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        },
      },
    ]);
  };

  const handleLinkPress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <>
      {isLoginFlag ? (
        <DrUserHead navigation={navigation} />
      ) : (
        <DrLoginHead navigation={navigation} />
      )}
      <SafeAreaView style={styles.safeArea}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.itemListContainer}>
            {drawerItems.map((item, index) => {
              const isFocused =
                state.routes.find(
                  (route: any) => route.name === item.navigateTo
                )?.key === focusedRouteKey;

              const shouldRender =
                isLoginFlag || (!isLoginFlag && !item.isLogout);

              if (!shouldRender) return null;

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
                    } else if (item.navigateTo === "Home") {
                      navigation.navigate("Home", { screen: "HomeBottom" });
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
        {/* --- Social Media Footer --- */}
        <View style={styles.drawerFooter}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : socialData.length > 0 ? (
            <>
              <Text style={styles.footerTitle}>Follow us on</Text>
              <View style={styles.socialContainer}>
                {socialData.map(({ platform, url, icon }) => (
                  <TouchableOpacity
                    key={platform}
                    onPress={() => handleLinkPress(url)}
                    style={styles.socialButton}
                  >
                    <Image source={{ uri: icon }} style={styles.socialIcon} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
        </View>
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
  // --- New Footer Styles ---
  drawerFooter: {
    backgroundColor: theme.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footerTitle: {
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    padding: 5,
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
});
