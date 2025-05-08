import React, { useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import theme from "../../../utils/theme";
import { StatusBar } from "expo-status-bar";
import ImageModule from "../../../ImageModule";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("window");

const spashImage = [
  { name: ImageModule.start1, id: "1" },
  { name: ImageModule.start2, id: "2" },
  { name: ImageModule.start3, id: "3" },
];

const StartScreen = ({ navigation }: any) => {
  const scrollRef: any = useRef(undefined);

  const changeSlideHandler = async (index: any) => {
    if (index !== 2) {
      scrollRef?.current?.scrollToOffset({
        offset: (index + 1) * width,
        animated: true,
      });
    } else {
      navigation.replace("LoginScreen");
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <FlatList
        ref={scrollRef}
        style={styles.flatList}
        data={spashImage}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Image source={item.name} style={{ height: "100%", width }} />
              <TouchableOpacity
                onPress={() => changeSlideHandler(index)}
                style={styles.touchBtn}
              >
                <AntDesign
                  name="arrowright"
                  size={30}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <View style={styles.dotContain}>
                {spashImage.map((item: any, ind: any) => (
                  <View
                    key={ind}
                    style={[
                      styles.dotDark,
                      index !== ind && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.dot,
                        index === ind && {
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  touchBtn: {
    position: "absolute",
    height: 60,
    width: 60,
    borderRadius: 30,
    bottom: height * 0.045,
    right: width * 0.1,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dotContain: {
    position: "absolute",
    bottom: height * 0.07,
    right: width * 0.42,
    flexDirection: "row",
  },
  dotDark: {
    backgroundColor: theme.colors.primaryDark,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
  },
});
export default StartScreen;
