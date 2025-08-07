import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import MyCourseListItem from "./Components/MyCourseListItem";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { getMyCoursesCall } from "../../../store/Services/Others";

const MyCoursesScreen = ({ navigation }: any) => {
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [myCoursesData, setMyCoursesData]: any = useState([]);

  const getAllCoursesManager = () => {
    getMyCoursesCall({
      query: {
        user_id: userDetails?.id,
      },
    })
      ?.then((res: any) => {
        if (res?.code == 1) {
          setMyCoursesData(res?.demoData);
        }
      })
      ?.catch((err: any) => console.log("err", err));
  };
  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (userDetails?.id) {
        getAllCoursesManager();
      }
    });
  }, [userDetails?.id, navigation]);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate("ViewCourseScreen", { courseId });
  };

  const handlePlayPress = (courseId: string) => {
    navigation.navigate("ViewCourseScreen", { courseId });
  };

  const renderCourseItem = ({ item }: { item: (typeof myCoursesData)[0] }) => (
    <MyCourseListItem
      course={item}
      onPress={() => handleCoursePress(item?.id)}
      onPlayPress={() => handlePlayPress(item?.id)}
    />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onSearchPress={() => navigation.navigate("SearchCourseScreen")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
        search
      />
      <Text style={styles.screenTitle}>My Courses</Text>
      <FlatList
        data={myCoursesData}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>There is no purchased courses!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  screenTitle: {
    fontSize: 20,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 30,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.lightGrey,
    marginLeft: 110,
  },
  emptyBox: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: theme.colors.red,
    ...theme.font.fontMedium,
  },
});

export default MyCoursesScreen;
