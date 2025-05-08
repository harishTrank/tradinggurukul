import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";

const SectionHeader = ({ title, onSeeMore }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSeeMore}>
        <Text style={styles.seeMore}>see All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    flexShrink: 1, // Allow title to wrap if long
    marginRight: 10,
  },
  seeMore: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
});

export default SectionHeader;
