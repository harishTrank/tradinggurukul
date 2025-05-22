import React, { useEffect } from "react";
import { View, Image } from "react-native";
import ImageModule from "../../ImageModule";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../JotaiStore";
import { getUserProfileCall } from "../../store/Services/Others";
import theme from "../../utils/theme";

const SplashScreen = ({ navigation }: any) => {
  const [userData, setUserDetailsState]: any = useAtom(userDetailsGlobal);
  useEffect(() => {
    setTimeout(async () => {
      const loginFlag: any = await AsyncStorage.getItem("loginFlag");
      if (loginFlag && loginFlag === "true") {
        const userData: any = await AsyncStorage.getItem("userDetail");
        const body: any = new FormData();
        body.append("user_id", JSON.parse(userData)?.id);
        getUserProfileCall({
          body,
        })
          ?.then((res: any) => {
            setUserDetailsState(res?.data);
          })
          ?.catch((err: any) => console.log("err", err));
        navigation?.replace("DrawerNavigation");
      } else {
        navigation?.replace("StartScreen");
      }
    }, 8000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.white,
      }}
    >
      <Image
        source={ImageModule.animatedLogo}
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />
    </View>
  );
};

export default SplashScreen;
