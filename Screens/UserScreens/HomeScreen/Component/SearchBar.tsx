import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";

interface SearchBarLookalikeProps {
  onPress: () => void;
  placeholder?: string;
}

const SearchBarLookalike = ({
  onPress,
  placeholder,
}: SearchBarLookalikeProps) => {
  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.placeholderText]} numberOfLines={1}>
        {placeholder || "Search..."}
      </Text>
      <View style={styles.searchIconContainer}>
        <Feather name="search" size={22} color={theme.colors.greyText} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    marginVertical: 15,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginRight: 10,
  },
  searchIconContainer: {},
});

export default SearchBarLookalike;
