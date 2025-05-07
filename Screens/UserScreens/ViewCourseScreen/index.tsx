// Screens/UserScreens/ViewCourseScreen.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // For meta icons
import FeatherIcon from "react-native-vector-icons/Feather"; // For back arrow

// Adjust paths as needed
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CourseDetail,
  MOCK_PURCHASED_COURSE_IDS,
  allCourseDetailsData,
} from "./Components/courseDetailsData";
import LessonListItem from "./Components/LessonListItem";

// Define your Stack Param List
type RootStackParamList = {
  // ... other screens
  ViewCourseScreen: { courseId: string };
};

type ViewCourseScreenRouteProp = RouteProp<
  RootStackParamList,
  "ViewCourseScreen"
>;
type ViewCourseScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewCourseScreen"
>;

const ViewCourseScreen = () => {
  const route = useRoute<ViewCourseScreenRouteProp>();
  const navigation = useNavigation<ViewCourseScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const foundCourse = allCourseDetailsData.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      // Simulate checking if the course is purchased
      setIsPurchased(
        MOCK_PURCHASED_COURSE_IDS.includes(foundCourse.id) &&
          !!foundCourse.lessons
      );
    } else {
      Alert.alert("Error", "Course not found.");
      navigation.goBack();
    }
  }, [courseId, navigation]);

  const handleAddToCart = () => {
    Alert.alert("Add to Cart", `"${course?.title}" added to cart (simulated).`);
  };

  const handleLessonPress = (lessonId: string) => {
    Alert.alert("Play Lesson", `Playing lesson ${lessonId} (simulated).`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerButton}
      >
        <FeatherIcon name="arrow-left" size={24} color={theme.colors.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Details</Text>
      <View style={styles.headerButton} />
    </View>
  );

  if (!course) {
    return (
      // Loading state or handle error
      <SafeAreaView
        style={[
          styles.safeArea,
          Platform.OS === "android" && { paddingTop: insets.top },
        ]}
      >
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text>Loading course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // NOT PURCHASED VIEW
  const renderNotPurchasedView = () => (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.videoPreviewContainer}>
          <Image
            source={course.videoPreviewUrl || course.imageUrl}
            style={styles.videoPreviewImage}
          />
          <TouchableOpacity style={styles.playButtonOverlay}>
            <Icon name="play-circle" size={60} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentPadding}>
          <Text style={styles.courseTitleMain}>{course.title}</Text>

          <View style={styles.metaInfoRow}>
            <View style={styles.metaItem}>
              <Icon
                name="clock-time-four-outline"
                size={16}
                color={theme.colors.greyText}
              />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon
                name="video-library"
                size={16}
                color={theme.colors.greyText}
              />
              <Text style={styles.metaText}>{course.lessonCount} Lessons</Text>
            </View>
          </View>
          <View style={styles.metaInfoRow}>
            <View style={styles.metaItem}>
              <Icon name="star" size={16} color={theme.colors.warning} />
              <Text style={styles.metaText}>
                {course.rating.toFixed(1)} {course.ratingCount}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon
                name="account-group-outline"
                size={16}
                color={theme.colors.greyText}
              />
              <Text style={styles.metaText}>{course.studentCount}</Text>
            </View>
          </View>

          <Text style={styles.shortDescription}>{course.shortDescription}</Text>

          <Text style={styles.sectionTitle}>About Course</Text>
          <Text style={styles.aboutCourseText}>{course.aboutCourse}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Text style={styles.priceText}>{course.price}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // PURCHASED VIEW (Lesson List)
  const renderPurchasedView = () => (
    <>
      <View style={styles.contentPaddingPurchased}>
        <Text style={styles.courseTitleMain}>{course.title}</Text>
      </View>
      <FlatList
        data={course.lessons || []}
        renderItem={({ item }) => (
          <LessonListItem item={item} onPress={handleLessonPress} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No lessons available for this course.
          </Text>
        }
      />
    </>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      {renderHeader()}
      {isPurchased ? renderPurchasedView() : renderNotPurchasedView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || "#EEE",
  },
  headerButton: {
    padding: 5,
    width: 30, // For consistent spacing
  },
  headerTitle: {
    fontSize: 18,
    ...theme.font.fontSemiBold,
    color: theme.colors.black,
    flex: 1,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 80, // Space for the fixed bottom bar
  },
  videoPreviewContainer: {
    width: "100%",
    height: 220, // Adjust as needed
    backgroundColor: theme.colors.black, // Fallback if image doesn't load
    justifyContent: "center",
    alignItems: "center",
  },
  videoPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButtonOverlay: {
    position: "absolute",
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentPaddingPurchased: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || "#EEE",
  },
  courseTitleMain: {
    fontSize: 22,
    ...theme.font.fontBold,
    color: theme.colors.black,
    marginBottom: 15,
  },
  metaInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Distribute space if needed, or set fixed width
  },
  metaText: {
    ...theme.font.fontRegular,
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: 6,
  },
  shortDescription: {
    ...theme.font.fontRegular,
    fontSize: 14,
    color: theme.colors.greyText,
    lineHeight: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    ...theme.font.fontSemiBold,
    color: theme.colors.black,
    marginBottom: 10,
    marginTop: 10,
  },
  aboutCourseText: {
    ...theme.font.fontRegular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom:
      Platform.OS === "ios" ? useSafeAreaInsets().bottom || 15 : 15, // Handle iOS bottom notch
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || "#DDD",
    elevation: 5, // Android shadow
  },
  priceText: {
    fontSize: 20,
    ...theme.font.fontBold,
    color: theme.colors.black,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartButtonText: {
    ...theme.font.fontSemiBold,
    color: theme.colors.white,
    fontSize: 16,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: theme.colors.greyText,
  },
});

export default ViewCourseScreen;
