import React from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import theme from "../../utils/theme";
import { TouchableOpacity } from "react-native";

const DrUserHead = ({ navigation }: any) => {
  return (
    <View style={styles.viewBox}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfileScreen")}
      >
        <Image
          style={styles.profile}
          source={require("../../assets/Images/dummy1.png")}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>Sophia Grace Bennett</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    width: "100%",
    height: "28%",
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profile: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    color: theme.colors.white,
    ...theme.font.fontSemiBold,
    fontSize: 18,
  },
});

export default DrUserHead;
