import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";

const TrialBanner = ({ onPress }: any) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Try free trial to enhance your creative journey!
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.trialLink}>Get free trial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FDF1F3",
    borderRadius: 10,
    padding: 20,
    marginVertical: 25,
    alignItems: "center",
  },
  bannerText: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    textAlign: "center",
    marginBottom: 10,
  },
  trialLink: {
    fontSize: 15,
    color: theme.colors.primary, // Use primary color for link
    ...theme.font.fontSemiBold,
  },
});

export default TrialBanner;
