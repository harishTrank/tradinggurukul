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
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectScript, setSelectScript]: any = useState({});
  const [categoryId, setCategoryId]: any = useState(undefined);

  useEffect(() => {
    if (route?.params?.script) {
      setIsLoading(true);
      setTimeout(() => {
        setSelectScript(route?.params?.script);
        setIsLoading(false);
      }, 1000);
    }
  }, [route?.params?.script]);

  const setCategoriesId = (select: any) => {
    setCategoryId(select?.id);
  };

  useEffect(() => {
    if (selectScript) {
      setCategoriesId(selectScript);
    }
  }, [selectScript]);

  const fetchCourses = useCallback(
    async (pageToFetch: number, isRefreshing: boolean = false) => {
      if (pageToFetch === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      if (!isRefreshing) setError(null);

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
            pageToFetch === 1 || isRefreshing
              ? newProducts
              : [...prevCourses, ...newProducts]
          );
          if (newProducts.length < PER_PAGE) {
            setHasMoreData(false);
          } else {
            setHasMoreData(true);
          }
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
    [categoryId]
  );

  useEffect(() => {
    fetchCourses(1);
  }, [fetchCourses, categoryId]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      fetchCourses(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    setSelectScript({});
    setHasMoreData(true);
    setError(null);
    fetchCourses(1, true);
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
    if (isLoading && courses.length === 0) return null;

    if (error && courses.length === 0) {
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
    if (!isLoading && courses.length === 0 && !error) {
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
          setValue={setSelectScript}
          placeholder={"Search..."}
          search={true}
          style={styles.dropDownStyle}
          fieldKey={"name"}
          objectSave={true}
        />

        {isLoading && courses.length === 0 && currentPage === 1 && !error && (
          <View style={styles.fullScreenLoaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {(!(isLoading && courses.length === 0 && currentPage === 1) ||
          error) && (
          <FlatList
            data={courses}
            renderItem={renderCourseItem}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : `course-${index}`
            }
            numColumns={2}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={ListEmptyComponent}
            onRefresh={handleRefresh}
            refreshing={isLoading && currentPage === 1 && !isLoadingMore}
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
    // paddingHorizontal: 15,
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
  },
  listContentContainer: {
    paddingBottom: 20,
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
  },
});

export default AllCoursesScreen;
