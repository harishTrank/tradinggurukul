import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../../Components/HomeHeader";
import SearchBar from "./Component/SearchBar";
import ImageSlider from "./Component/ImageSlider";
import SectionHeader from "./Component/SectionHeader";
import CategoryCard from "./Component/CategoryCard";
import TrialBanner from "./Component/TrialBanner";
import CourseCard from "./Component/CourseCard";
import theme from "../../../utils/theme";

const { width } = Dimensions.get("window");

const sliderData = [
  {
    id: "1",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "2",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "3",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
];

const popularCategories = [
  {
    id: "cat1",
    title: "Stock Analysis",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat2",
    title: "Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat3",
    title: "Design",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
];

const mostWatching = [
  {
    id: "crs1",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.0,
    ratingCount: 351,
  },
  {
    id: "crs2",
    title: "Advanced Stock Trading Strategies",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.8,
    ratingCount: 655,
  },
  {
    id: "crs3",
    title: "UI/UX Design Fundamentals",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.5,
    ratingCount: 420,
  },
];

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSeeMore = (section: string) => {
    console.log(`See More pressed for: ${section}`);
  };

  const handleCardPress = (item: any) => {
    console.log(`Card pressed: ${item.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onSearchPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Greeting Area --- */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greeting}>Hola, Sophia!</Text>
            <Text style={styles.subtitle}>What do you wanna learn today?</Text>
          </View>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
        </View>

        {/* --- Search Bar --- */}
        <SearchBar
          placeholder="Digital Marketing"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* --- Image Slider --- */}
        <ImageSlider data={sliderData} />

        {/* --- Popular Categories --- */}
        <SectionHeader
          title="Popular category our in platform"
          onSeeMore={() => handleSeeMore("Popular")}
        />
        <FlatList
          data={popularCategories}
          renderItem={({ item }) => (
            <CategoryCard
              title={item.title}
              imageUrl={item.imageUrl}
              onPress={() => handleCardPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
        />

        {/* --- Trial Banner --- */}
        <TrialBanner onPress={() => console.log("Get free trial pressed")} />

        {/* --- Most Watching --- */}
        <SectionHeader
          title="Most watching category in month"
          onSeeMore={() => handleSeeMore("Most Watching")}
        />
        <FlatList
          data={mostWatching}
          renderItem={({ item }) => (
            <CourseCard
              title={item.title}
              imageUrl={item.imageUrl}
              rating={item.rating}
              ratingCount={item.ratingCount}
              onPress={() => handleCardPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 20,
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5,
  },
  greeting: {
    fontSize: 24,
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  horizontalListPadding: {
    paddingLeft: 2,
    paddingBottom: 10,
  },
});

export default HomeScreen;
