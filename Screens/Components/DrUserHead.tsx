import React from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import theme from "../../utils/theme";
import { TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../JotaiStore";

const DrUserHead = ({ navigation }: any) => {
  const [userDetails]: any = useAtom(userDetailsGlobal);
  return (
    <View style={styles.viewBox}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfileScreen")}
        style={styles.touchableStyle}
      >
        <Image
          style={styles.profile}
          source={{ uri: userDetails?.avatar_url }}
        />
        <Text
          style={styles.userName}
        >{`${userDetails?.first_name} ${userDetails?.last_name}`}</Text>
      </TouchableOpacity>
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
  touchableStyle: {
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
