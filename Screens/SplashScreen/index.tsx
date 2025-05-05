import React, { useEffect } from "react";
import { View, Image } from "react-native";
import ImageModule from "../../ImageModule";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(async () => {
      navigation?.replace("UserScreens");
    }, 500);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={ImageModule.splash}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

export default SplashScreen;
