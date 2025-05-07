import React from "react";
import theme from "../../utils/theme";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ImageModule from "../../ImageModule";

const DrLoginHead = ({ navigation }: any) => {
  return (
    <View style={styles.viewBox}>
      <Image source={ImageModule.logoWhite} style={styles.logoStyle} />
      <View style={styles.rapper}>
        <Image source={ImageModule.defaultUser} style={styles.userIcon} />
        <TouchableOpacity
          style={styles.btnBox}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.btnText}>Login/Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    width: "100%",
    height: "23%",
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoStyle: {
    height: "50%",
    width: "70%",
    objectFit: "contain",
  },
  rapper: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userIcon: {
    height: 40,
    width: 40,
    marginRight: 20,
  },
  btnBox: {
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
  },
  btnText: {
    color: theme.colors.primary,
    ...theme.font.fontSemiBold,
  },
});

export default DrLoginHead;
