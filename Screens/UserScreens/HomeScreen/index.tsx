import React from "react";
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
import CourseCard from "./Component/CourseCard";
import theme from "../../../utils/theme";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import {
  useBannersCall,
  useCustomProductsCall,
  useGetCategoryCall,
} from "../../../hooks/Others/query";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const navigation: any = useNavigation();
  const bannersApi: any = useBannersCall();
  const categoriesApi: any = useGetCategoryCall();
  const topSearchApi: any = useCustomProductsCall({
    query: {
      page: 1,
      per_page: 10,
      sort: "popularity",
    },
  });

  const handleSeeMore = (section: string) => {
    console.log(`See More pressed for: ${section}`);
    if (section === "Top Search") {
      navigation.navigate("AllCourses");
    } else {
      navigation.navigate("SearchCourseScreen");
    }
  };

  const handleCardPress = (item: any) => {
    console.log(`Card pressed: ${item.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {bannersApi?.isLoading && <FullScreenLoader />}
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
            <Text style={styles.greeting}>
              Hola, {userDetails?.first_name || "User"}!
            </Text>
            <Text style={styles.subtitle}>What do you wanna learn today?</Text>
          </View>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
        </View>

        {/* --- Search Bar --- */}
        <SearchBar
          placeholder="Search..."
          onPress={() => navigation.navigate("SearchCourseScreen")}
        />

        {/* --- Image Slider --- */}
        <ImageSlider data={bannersApi?.data?.banner} />

        {/* --- Popular Categories --- */}
        <SectionHeader
          title={`Popular category`}
          onSeeMore={() => handleSeeMore("Popular")}
        />
        <FlatList
          data={categoriesApi?.data || []}
          renderItem={({ item }) => (
            <CategoryCard
              title={item?.name}
              imageUrl={item?.image?.src}
              onPress={() => handleCardPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
        />

        {/* --- Trial Banner --- */}
        {/* <TrialBanner onPress={() => console.log("Get free trial pressed")} /> */}

        {/* --- Most Watching --- */}
        <SectionHeader
          title="Top Searches"
          onSeeMore={() => handleSeeMore("Top Search")}
        />
        <FlatList
          data={topSearchApi?.data?.product || []}
          renderItem={({ item }) => (
            <CourseCard
              title={item?.name}
              imageUrl={item?.images?.[0]?.src}
              price={item?.price}
              regular_price={item?.regular_price}
              tag={item?.categories?.[0]?.name}
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
