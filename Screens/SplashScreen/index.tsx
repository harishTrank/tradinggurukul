import React, { useEffect } from "react";
import { View, Image } from "react-native";
import ImageModule from "../../ImageModule";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(async () => {
      const loginFlag: any = await AsyncStorage.getItem("loginFlag");
      if (loginFlag && loginFlag === "true") {
        navigation?.replace("DrawerNavigation");
      } else {
        navigation?.replace("StartScreen");
      }
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
