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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import CategoryCard from "./Component/CategoryCard";
import SearchResultCard from "./Component/SearchResultCard";
import FilterModal from "./Component/FilterModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const topSearchesData = [
  "Stock Analysis",
  "CryptoTrading",
  "Froex Trading",
  "marketing",
];

const searchResults = [
  {
    id: "sr1",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    priceStatus: "Free",
    studentCount: 4000,
    rating: 4.7,
  },
  {
    id: "sr2",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    priceStatus: "Free",
    studentCount: 2000,
    rating: 4.0,
  },
  {
    id: "sr3",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    priceStatus: "Paid",
    studentCount: 1000,
    rating: 4.2,
  },
];

const categoriesData = [
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
    title: "Stock Analysis",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat4",
    title: "Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat5",
    title: "Stock Analysis",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat6",
    title: "Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat7",
    title: "Stock Analysis",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
  {
    id: "cat8",
    title: "Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
  },
];

const SearchCourseScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
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

  const handleTopSearchPress = (searchTerm: string) => {
    console.log("Top Search Pressed:", searchTerm);
    setSearchQuery(searchTerm);
  };

  const handleCategoryPress = (categoryId: string, categoryTitle: string) => {
    console.log("Category Pressed:", categoryTitle);
  };

  const renderCategoryItem = ({
    item,
  }: {
    item: (typeof categoriesData)[0];
  }) => (
    <View style={styles.categoryItemContainer}>
      <CategoryCard
        title={item.title}
        imageUrl={item.imageUrl}
        onPress={() => handleCategoryPress(item.id, item.title)}
      />
    </View>
  );

  const handleResultPress = (itemId: string) => {
    console.log("Search Result Pressed:", itemId);
  };

  const searchBtnHandler = () => {
    if (searchQuery.length > 0) {
      setSearchState(true);
    }
  };

  const renderSearchResult = ({
    item,
  }: {
    item: (typeof searchResults)[0];
  }) => <SearchResultCard item={item} onPress={handleResultPress} />;

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
            onPress={searchBtnHandler}
          >
            <Feather name="search" size={22} color={theme.colors.greyText} />
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
            data={categoriesData}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      ) : (
        <>
          <Modal
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
          </Modal>
          <View style={styles.filterBox}>
            <Text style={styles.filterText}>Your search result</Text>
            <TouchableOpacity>
              <Feather
                name="filter"
                onPress={() => setIsFilterVisible(true)}
                size={24}
                color={theme.colors.greyText}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
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
});

export default SearchCourseScreen;
