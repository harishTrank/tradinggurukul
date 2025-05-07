// Screens/UserScreens/MyCoursesScreen.tsx (or AllCoursesScreen.tsx)
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // Or your specific navigator prop type
import theme from "../../../utils/theme";
import HomeHeader from "../../Components/HomeHeader"; // Assuming you have this component
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCard, { Course } from "./Components/CourseCard";

const allCoursesData: Course[] = [
  {
    id: "course1",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace with your actual image
    rating: 4.0,
    reviews: "(551)",
    price: "₹999",
  },
  {
    id: "course2",
    title: "Advanced SEO Strategies",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace with your actual image
    rating: 4.5,
    reviews: "(782)",
    price: "₹1499",
  },
  {
    id: "course3",
    title: "Social Media Marketing Mastery",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 4.2,
    reviews: "(630)",
    price: "₹1299",
  },
  {
    id: "course4",
    title: "Content Creation for Beginners",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 3.9,
    reviews: "(410)",
    price: "₹799",
  },
  {
    id: "course5",
    title: "Email Marketing Fundamentals",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 4.8,
    reviews: "(915)",
    price: "₹1999",
  },
  {
    id: "course6",
    title: "PPC Advertising with Google Ads",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 4.3,
    reviews: "(590)",
    price: "₹1199",
  },
  {
    id: "course7",
    title: "Web Analytics and Data Insights",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 4.6,
    reviews: "(850)",
    price: "₹1799",
  },
  {
    id: "course8",
    title: "Affiliate Marketing for Profit",
    imageUrl: require("../../../assets/Images/dummy1.png"), // Replace
    rating: 4.1,
    reviews: "(499)",
    price: "₹1099",
  },
];

type MyCoursesScreenNavigationProp = StackNavigationProp<any>; // Generic for simplicity

const AllCoursesScreen = () => {
  const navigation = useNavigation<MyCoursesScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleCoursePress = (courseId: string) => {
    console.log("Course pressed:", courseId);
    // navigation.navigate('CourseDetailScreen', { courseId }); // Example navigation
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard item={item} onPress={handleCoursePress} />
  );

  // Mock header functions for HomeHeader
  const handleMenuPress = () => {
    // Assuming you use a drawer navigator
    if ((navigation as any).openDrawer) {
      (navigation as any).openDrawer();
    } else if ((navigation as any).toggleDrawer) {
      (navigation as any).toggleDrawer();
    } else {
      console.log("Menu pressed - Implement drawer toggle");
    }
  };

  const handleCartPress = () => {
    console.log("Cart pressed");
    // navigation.navigate('CartScreen');
  };

  const handleSearchPress = () => {
    console.log("Search pressed");
    // navigation.navigate('SearchScreen');
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress} // Add if your header supports it
        onCartPress={handleCartPress}
        // Add other props your HomeHeader might need (e.g., title)
      />

      <View style={styles.mainContainer}>
        <Text style={styles.screenTitle}>All Courses</Text>

        <FlatList
          data={allCoursesData}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 20,
    ...theme.font.fontBold,
    color: theme.colors.black,
    marginTop: 15,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});

export default AllCoursesScreen;
