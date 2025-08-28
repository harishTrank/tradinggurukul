import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native"; // <-- Import Text
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../../utils/theme";
import ImageModule from "../../ImageModule";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { unReadNotificationGlobal, userDetailsGlobal } from "../../JotaiStore";

const logoSource = ImageModule.appIcon;

const HomeHeader = ({
  onMenuPress,
  onSearchPress,
  onCartPress,
  search,
  menu = true,
  cart = true,
}: any) => {
  const navigation: any = useNavigation();
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [noticount]: any = useAtom(unReadNotificationGlobal);
  const onNotificationPress = () => {
    navigation.navigate("NotificationScreen");
  };

  const renderNotificationBadge = () => {
    if (!noticount || noticount <= 0) {
      return null;
    }

    const badgeText = noticount > 99 ? "99+" : noticount;

    return (
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      {menu ? (
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Feather name="menu" size={28} color={theme.colors.black} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <TouchableOpacity onPress={() => navigation.navigate("HomeBottom")}>
        <Image
          source={logoSource}
          style={[styles.logo, !userDetails?.id && { marginLeft: -25 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.rightIcons}>
        {search && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Feather name="search" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        )}
        {cart && userDetails?.id && (
          <>
            {/* --- MODIFIED: NOTIFICATION ICON CONTAINER --- */}
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color={theme.colors.black}
              />
              {/* Call the function to render the badge here */}
              {renderNotificationBadge()}
            </TouchableOpacity>

            <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
              <Ionicons
                name="cart-outline"
                size={26}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    width: "100%",
    paddingHorizontal: 10,
  },
  logo: {
    height: 30,
    width: 150,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    // This container is the reference for the absolute positioning of the badge
  },
  // --- NEW STYLES FOR THE BADGE ---
  badgeContainer: {
    position: "absolute",
    top: 2, // Adjust position as needed
    right: 2, // Adjust position as needed
    backgroundColor: "red",
    borderRadius: 9, // Make it circular
    height: 18,
    minWidth: 18, // Ensure it's circular even with one digit
    paddingHorizontal: 4, // Add padding for double digits or '99+'
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HomeHeader;
