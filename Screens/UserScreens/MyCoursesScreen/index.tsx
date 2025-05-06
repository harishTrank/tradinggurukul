import React from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../HomeScreen/Component/HomeHeader";
import theme from "../../../utils/theme";
import MyCourseListItem from "./Components/MyCourseListItem";

const myCoursesData = [
  {
    id: "mc1",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.0,
    ratingCount: 351,
    status: "viewed" as const,
  },
  {
    id: "mc2",
    title: "Advanced Stock Trading Strategies",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.8,
    ratingCount: 655,
    status: "pending" as const,
  },
  {
    id: "mc3",
    title: "UI/UX Design Fundamentals",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.5,
    ratingCount: 420,
    status: "pending" as const,
  },
  {
    id: "mc4",
    title: "Python for Data Science Beginners",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.2,
    ratingCount: 210,
    status: "pending" as const,
  },
  {
    id: "mc5",
    title: "Mastering React Native Development",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.9,
    ratingCount: 830,
    status: "viewed" as const,
  },
  {
    id: "mc6",
    title: "The Complete Guide to Photography",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.4,
    ratingCount: 515,
    status: "pending" as const,
  },
];

const MyCoursesScreen = ({ navigation }: any) => {
  const handleCoursePress = (courseId: string) => {
    console.log("Navigate to Course Details:", courseId);
    // navigation.navigate('CourseDetailScreen', { courseId });
  };

  const handlePlayPress = (courseId: string) => {
    console.log("Play Video for Course:", courseId);
    // navigation.navigate('VideoPlayerScreen', { courseId });
  };

  const renderCourseItem = ({ item }: { item: (typeof myCoursesData)[0] }) => (
    <MyCourseListItem
      course={item}
      onPress={handleCoursePress}
      onPlayPress={handlePlayPress}
    />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onSearchPress={() => navigation.navigate("SearchCourseScreen")}
        onCartPress={() => console.log("Cart pressed")}
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
    paddingBottom: 80,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.lightGrey,
    marginLeft: 110,
  },
});

export default MyCoursesScreen;
