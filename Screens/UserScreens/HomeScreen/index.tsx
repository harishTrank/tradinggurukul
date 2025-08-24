import React, { useEffect } from "react"; // Added useEffect
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Alert, // Added Alert
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
import { createStackNavigator } from "@react-navigation/stack";
import AllCoursesScreen from "../AllCoursesScreen";

const { width } = Dimensions.get("window");
const Stack = createStackNavigator<any>();

const HomeScreenComponent = () => {
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

  // --- Start of Added Code ---

  // Combine the loading states of all relevant APIs.
  const isAnyApiLoading =
    bannersApi?.isLoading ||
    categoriesApi?.isLoading ||
    topSearchApi?.isLoading;

  useEffect(() => {
    let timeoutId: any = null;

    // If any API is loading, set a 1-minute timer.
    if (isAnyApiLoading) {
      timeoutId = setTimeout(() => {
        // If the timer finishes, it means an API is still loading. Show the alert.
        Alert.alert(
          "Loading...",
          "The app is taking a while to load. Please restart the app or clear the app cache if this issue persists.",
          [{ text: "OK" }]
        );
      }, 30000);
    }

    // Cleanup function: This will run when the component unmounts or when
    // `isAnyApiLoading` changes. If the data loads successfully before 1 minute,
    // this will clear the timer and prevent the alert from showing.
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAnyApiLoading]); // This effect re-runs only when the combined loading state changes.

  // --- End of Added Code ---

  const handleSeeMore = (section: string) => {
    console.log(`See More pressed for: ${section}`);
    if (section === "Top Search") {
      navigation.navigate("AllCourses");
    } else {
      navigation.navigate("SearchCourseScreen");
    }
  };

  const handleCardPress = (val: any, type: any) => {
    if (type === "Top Search") {
      navigation.navigate("ViewCourseScreen", { courseId: val });
    } else {
      navigation.navigate("SearchCourseScreen", { searchText: val });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* This loader will only show for the bannersApi, as per your original code. */}
      {bannersApi?.isLoading && <FullScreenLoader />}
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
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
              Hello, {userDetails?.first_name || "User"}!
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
        <ImageSlider navigation={navigation} data={bannersApi?.data?.banner} />

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
              onPress={() => handleCardPress(item?.name, "Popular")}
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
              onPress={() => handleCardPress(item?.id, "Top Search")}
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

const HomeScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"HomeScreenComponent"}
    >
      <Stack.Screen
        name="HomeScreenComponent"
        component={HomeScreenComponent}
      />
      <Stack.Screen name="AllCoursesSearch" component={AllCoursesScreen} />
    </Stack.Navigator>
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
