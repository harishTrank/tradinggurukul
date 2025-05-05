import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../../../../utils/theme";
import ImageModule from "../../../../ImageModule";

const logoSource = ImageModule.appIcon;

const HomeHeader = ({ onMenuPress, onNotificationPress, onCartPress }: any) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
        <Feather name="menu" size={28} color={theme.colors.black} />
      </TouchableOpacity>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconButton}
        >
          <Feather name="bell" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
          {/* Using Ionicons for a filled cart look, Feather's is outline */}
          <Ionicons name="cart-outline" size={26} color={theme.colors.black} />
        </TouchableOpacity>
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
    height: 30, // Adjust size as needed
    width: 150, // Adjust size as needed
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5, // Increase touchable area
  },
});

export default HomeHeader;
