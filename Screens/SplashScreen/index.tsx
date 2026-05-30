import React, { useEffect } from "react";
import { View, Image } from "react-native";
import ImageModule from "../../ImageModule";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { unReadNotificationGlobal, userDetailsGlobal } from "../../JotaiStore";
import { getUserProfileCall, unReadNotificationCountApi } from "../../store/Services/Others";
import theme from "../../utils/theme";

const SplashScreen = ({ navigation }: any) => {
  const [, setUserDetailsState]: any = useAtom(userDetailsGlobal);
  const [,setNotiCount]: any = useAtom(unReadNotificationGlobal);

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
            unReadNotificationCountApi({
              query: {
                user_id: res?.data?.id
              }
            })?.then((res2: any) => setNotiCount(res2?.unread_count))
            ?.catch((err: any) => console.log('err', err))
          })
          ?.catch((err: any) => console.log("err", err));
        navigation?.replace("DrawerNavigation");
      } else {
        navigation?.replace("StartScreen");
      }
    }, 4900);
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
