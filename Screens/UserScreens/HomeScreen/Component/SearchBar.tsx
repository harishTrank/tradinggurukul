import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";

const SearchBar = ({ value, onChangeText, placeholder }: any) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder || "Search..."}
        placeholderTextColor={theme.colors.greyText}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.searchIcon}>
        <Feather name="search" size={22} color={theme.colors.greyText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontRegular,
    marginRight: 10,
  },
  searchIcon: {},
});

export default SearchBar;
