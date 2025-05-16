import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import CategoryCard from "./Component/CategoryCard";
import SearchResultCard from "./Component/SearchResultCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetCategoryCall } from "../../../hooks/Others/query";
import { useCustomSearchCourseCall } from "../../../hooks/Others/mutation";

const topSearchesData = [
  "Stock Market",
  "Crypto Currency",
  "Digital Marketing",
  "Graphic Designing",
];

const SearchCourseScreen = ({ navigation, route }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const categoriesApi: any = useGetCategoryCall();
  const searchCourses: any = useCustomSearchCourseCall();
  const [searchResultData, setSearchResultData]: any = useState([]);
  const [currentFilters, setCurrentFilters] = useState({
    sortBy: "free",
    level: null,
    duration: null,
  });
  const handleApplyFilters = (newFilters: any) => {
    console.log("Filters applied in parent:", newFilters);
    setCurrentFilters(newFilters);
    setIsFilterVisible(false);
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchState(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (route?.params?.searchText) {
      setTimeout(() => {
        setSearchQuery(route?.params?.searchText);
        setSearchState(true);
      }, 500);
    }
  }, [route?.params?.searchText]);

  const handleTopSearchPress = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setSearchState(true);
  };

  const handleCategoryPress = (categoryId: any, categoryName: string) => {
    setSearchQuery(categoryName);
    setSearchState(true);
  };

  const searchCoursesManager = () => {
    searchCourses
      ?.mutateAsync({
        body: {
          search: searchQuery,
          per_page: 20,
        },
      })
      ?.then((res: any) => {
        setSearchResultData(res?.products);
      })
      ?.catch((err: any) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (searchQuery?.length > 0 && searchState) {
      searchCoursesManager();
    }
  }, [searchQuery, searchState]);

  const renderCategoryItem = ({ item }: any) => (
    <View style={styles.categoryItemContainer}>
      <CategoryCard
        title={item.name}
        imageUrl={item?.image?.src}
        onPress={() => handleCategoryPress(item.id, item?.name)}
      />
    </View>
  );

  const handleResultPress = (itemId: string) => {
    navigation.navigate("ViewCourseScreen", { courseId: itemId });
  };

  const searchBtnHandler = () => {
    if (searchQuery.length > 0) {
      setSearchState(true);
    }
  };

  const crossBtnHandler = () => {
    setSearchQuery("");
    setSearchState(false);
  };

  const renderSearchResult = ({ item }: any) => (
    <SearchResultCard item={item} onPress={handleResultPress} />
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS !== "ios" && { paddingTop: useSafeAreaInsets().top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onSearchPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
        menu={false}
      />

      <View style={styles.searchSection}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.grey} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Courses..."
            placeholderTextColor={theme.colors.greyText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() =>
              !searchState ? searchBtnHandler() : crossBtnHandler()
            }
          >
            <Feather
              name={!searchState ? "search" : "x"}
              size={22}
              color={theme.colors.greyText}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!searchState ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Top searches</Text>
          <View style={styles.topSearchesContainer}>
            {topSearchesData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chip}
                onPress={() => handleTopSearchPress(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categoriesApi?.data || []}
            renderItem={renderCategoryItem}
            keyExtractor={(item: any, index: any) => index}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      ) : (
        <>
          {/* <Modal
            animationType="slide"
            transparent={false}
            visible={isFilterVisible}
            onRequestClose={() => setIsFilterVisible(false)}
          >
            <FilterModal
              onClose={() => setIsFilterVisible(false)}
              onApply={handleApplyFilters}
              initialFilters={currentFilters}
            />
          </Modal> */}
          <View style={styles.filterBox}>
            <Text style={styles.filterText}>Your search result</Text>
            {/* <TouchableOpacity>
              <Feather
                name="filter"
                onPress={() => setIsFilterVisible(true)}
                size={24}
                color={theme.colors.greyText}
              />
            </TouchableOpacity> */}
          </View>
          <FlatList
            data={searchResultData || []}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View>
                {searchCourses?.isLoading || searchCourses?.isPending ? (
                  <View style={styles.emptyBox}>
                    <ActivityIndicator
                      size={"large"}
                      color={theme.colors.primary}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                      No courses found for "{searchQuery}"
                    </Text>
                  </View>
                )}
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontRegular,
    marginRight: 10,
  },
  searchIcon: {},
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginTop: 20,
    marginBottom: 15,
  },
  topSearchesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.black,
    ...theme.font.fontRegular,
  },
  categoryRow: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryItemContainer: {
    width: "48%",
  },
  filterBox: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontSize: 15,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  emptyBox: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...theme.font.fontMedium,
    fontSize: 16,
    color: theme.colors.primary,
  },
});

export default SearchCourseScreen;
