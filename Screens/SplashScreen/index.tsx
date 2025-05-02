import React, { useEffect } from "react";
import { SafeAreaView, Image } from "react-native";
import ImageModule from "../../ImageModule";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(async () => {
      navigation?.replace("UserScreens");
    }, 500);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <Image
        source={ImageModule.appIconCrop}
        style={{
          height: 250,
          width: 250,
          resizeMode: "contain",
        }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
