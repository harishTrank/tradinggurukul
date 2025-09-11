import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  Button,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import theme from "../../../utils/theme";
import HomeHeader from "../../Components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCard, { Course } from "./Components/CourseCard";
import { customProductsCall } from "../../../store/Services/Others";
import DropDownComponent from "../../Components/DropDownComponent";
import { useGetCategoryCall } from "../../../hooks/Others/query";

type MyCoursesScreenNavigationProp = StackNavigationProp<any>;

const PER_PAGE = 10;
const { width } = Dimensions.get("screen");

const AllCoursesScreen = ({ route }: any) => {
  const navigation = useNavigation<MyCoursesScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const categoriesApi: any = useGetCategoryCall();

  // --- FIX 1: Initialize state directly from route.params ---
  // This ensures that from the very first render, the component knows which
  // category to fetch, preventing the initial fetch of "all" courses.
  const [selectScript, setSelectScript] = useState<any>(
    route?.params?.script || {}
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    route?.params?.script?.id || route?.params?.script?.banner_category
  );

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FIX 2: Create a single handler for category changes ---
  // This function ensures that both the UI state (selectScript) and the
  // data-fetching state (categoryId) are updated together consistently.
  const handleCategoryChange = (selectedItem: any) => {
    setSelectScript(selectedItem || {}); // Use empty object if null/undefined
    setCategoryId(selectedItem?.id || selectedItem?.banner_category);
  };

  const fetchCourses = useCallback(
    async (pageToFetch: number, isRefreshing: boolean = false) => {
      // Start loading indicators immediately
      if (pageToFetch === 1) {
        setIsLoading(true);
        // Clear courses immediately for a new filter/refresh to prevent showing stale data
        if (!isRefreshing) {
          setCourses([]);
        }
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const res: any = await customProductsCall({
          query: {
            page: pageToFetch,
            per_page: PER_PAGE,
            sort: "default",
            category: categoryId,
          },
        });

        const newProducts: Course[] = res?.product || [];

        if (newProducts.length > 0) {
          setCourses((prevCourses) =>
            pageToFetch === 1 ? newProducts : [...prevCourses, ...newProducts]
          );
          setHasMoreData(newProducts.length >= PER_PAGE);
        } else {
          setHasMoreData(false);
          if (pageToFetch === 1) {
            setCourses([]);
          }
        }
        setCurrentPage(pageToFetch);
      } catch (err: any) {
        console.log("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [categoryId] // The fetch logic now only depends on the categoryId
  );

  // --- FIX 3: Simplified and corrected fetch effect ---
  // This useEffect now correctly triggers a fetch only when the categoryId changes.
  // Because categoryId is initialized correctly from the start, the first fetch
  // will have the correct filter applied.
  useEffect(() => {
    fetchCourses(1);
  }, [fetchCourses]); // This depends on the memoized fetchCourses function

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      fetchCourses(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    // --- FIX 4: Explicitly clear the category filter on refresh ---
    handleCategoryChange(null);
    setHasMoreData(true);
    // Note: Calling handleCategoryChange will trigger the useEffect above to
    // fetch all courses automatically. You could optionally call fetchCourses here
    // for more immediate feedback if needed, but it's not strictly necessary.
  };

  const handleCoursePress = (courseId: string) => {
    navigation.navigate("ViewCourseScreen", { courseId });
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard item={item} onPress={() => handleCoursePress(item.id)} />
  );

  const handleMenuPress = () => {
    if ((navigation as any).openDrawer) (navigation as any).openDrawer();
    else if ((navigation as any).toggleDrawer)
      (navigation as any).toggleDrawer();
    else console.log("Menu pressed - Implement drawer toggle");
  };

  const handleCartPress = () => navigation.navigate("CartScreen");

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <ActivityIndicator
        style={styles.footerLoader}
        size="large"
        color={theme.colors.primary}
      />
    );
  };

  const ListEmptyComponent = () => {
    // Return null while the initial data is loading to avoid showing "No courses" prematurely
    if (isLoading && currentPage === 1) {
      return null;
    }

    if (error) {
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={() => fetchCourses(1)}
            color={theme.colors.primary}
          />
        </View>
      );
    }

    // Only show "No courses found" if not loading and the list is truly empty.
    if (!isLoading && courses.length === 0) {
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>No courses found.</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        !route?.params?.script &&
          Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader onMenuPress={handleMenuPress} onCartPress={handleCartPress} />

      <Text style={styles.screenTitle}>All Courses</Text>
      <View style={styles.mainContainer}>
        <DropDownComponent
          data={categoriesApi?.data || []}
          value={selectScript?.name}
          setValue={handleCategoryChange} // Use the new unified handler
          placeholder={"Search..."}
          search={true}
          style={styles.dropDownStyle}
          fieldKey={"name"}
          objectSave={true}
        />

        {/* --- FIX 5: Improved Loading UI --- */}
        {/* Show a full-screen loader only on the initial load for a better UX */}
        {isLoading && currentPage === 1 ? (
          <View style={styles.fullScreenLoaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={courses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={ListEmptyComponent}
            onRefresh={handleRefresh}
            refreshing={isLoading && currentPage === 1}
          />
        )}
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
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 20,
    ...theme.font.fontBold,
    color: theme.colors.black,
    marginLeft: 15,
    marginVertical: 5,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5, // Added for spacing between columns
  },
  footerLoader: {
    marginVertical: 20,
  },
  fullScreenLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    height: Dimensions.get("window").height * 0.5, // Give it some height
  },
  emptyListText: {
    fontSize: 16,
    color: theme.colors.grey,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  dropDownStyle: {
    width: width - 30,
    marginBottom: 10,
  },
});

export default AllCoursesScreen;
