// Screens/UserScreens/ViewCourseScreen.tsx
import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
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
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LessonListItem from "./Components/LessonListItem";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { getCourseDetailsCall } from "../../../store/Services/Others";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import RenderHTML from "react-native-render-html";

const { width } = Dimensions.get("window");

const tagsStyles: any = {
  body: {
    whiteSpace: "normal",
    color: theme.colors.text,
  },
  a: {
    color: theme.colors.primary,
  },
  strong: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  h2: {
    fontWeight: "bold",
    fontSize: "20px",
  },
};

const getProcessedHtml = (descriptionString: any) => {
  if (!descriptionString) {
    return "<p>No description available.</p>";
  }

  let html = descriptionString;
  html = html.replace(/\\n/g, "<br />");
  html = html.replace(/\n/g, "<br />");
  html = html.replace(/(<(ul|ol)(?: [^>]*)?>)\s*<br\s*\/?>/gi, "$1");
  html = html.replace(/<\/li>\s*<br\s*\/?>\s*(<li(?: [^>]*)?>)/gi, "</li>$1");
  html = html.replace(/<br\s*\/?>\s*(<\/(ul|ol)>)/gi, "$1");
  return html;
};

const ViewCourseScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;
  const [course, setCourse]: any = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [userDetails]: any = useAtom(userDetailsGlobal);

  const viewCourseApiCallManager = () => {
    getCourseDetailsCall({
      query: {
        id: courseId,
        user_id: userDetails?.id,
      },
    })
      ?.then((res: any) => {
        setIsPurchased(res?.purchased);
        setCourse(res);
      })
      ?.catch((err: any) => console.log("err", JSON.stringify(err)));
  };

  useEffect(() => {
    if (courseId) {
      viewCourseApiCallManager();
    }
  }, [courseId]);

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

  const bottomBarStyle = useMemo(
    () => ({
      ...styles.bottomBarBase,
      paddingBottom: Platform.OS === "ios" ? insets.bottom || 15 : 15,
    }),
    [insets.bottom]
  );

  if (!course) {
    return (
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

  const renderNotPurchasedView = () => (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {
            paddingBottom:
              Platform.OS === "ios" ? (insets.bottom || 15) + 65 : 65,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoPreviewContainer}>
          <Image
            source={{ uri: course?.images?.[0]?.src }}
            style={styles.videoPreviewImage}
          />
          {/* <TouchableOpacity style={styles.playButtonOverlay}>
            <Icon name="play-circle" size={60} color={theme.colors.white} />
          </TouchableOpacity> */}
        </View>

        <View style={styles.contentPadding}>
          <Text style={styles.courseTitleMain}>{course?.name}</Text>
          <View style={styles.priceTagBox}>
            <Text style={styles.priceTag}>₹{course?.price}</Text>
            <Text style={styles.regularPrice}>₹{course?.regular_price}</Text>
          </View>
          <View style={styles.priceTagBox}>
            <AntDesign name="earth" size={20} color={theme.colors.black} />
            <Text style={styles.updatedDateText}>{`Updated on ${dayjs(
              course?.date_modified
            ).format("DD-MM-YYYY")}`}</Text>
          </View>
          <RenderHTML
            contentWidth={width}
            source={{
              html: getProcessedHtml(course.description),
            }}
            tagsStyles={tagsStyles}
          />
        </View>
      </ScrollView>
      <View style={bottomBarStyle}>
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
        contentContainerStyle={{ paddingBottom: insets.bottom || 10 }}
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
    width: 30,
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
  scrollContentContainer: {},
  videoPreviewContainer: {
    width: "100%",
    height: 220,
    backgroundColor: theme.colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  priceTag: {
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    fontSize: 16,
  },
  playButtonOverlay: {
    position: "absolute",
  },
  regularPrice: {
    color: theme.colors.black,
    ...theme.font.fontMedium,
    fontSize: 13,
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  updatedDateText: {
    color: theme.colors.black,
    ...theme.font.fontMedium,
    fontSize: 13,
    marginLeft: 10,
  },
  priceTagBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
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
    fontSize: 20,
    ...theme.font.fontBold,
    color: theme.colors.black,
  },
  metaInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaText: {
    ...theme.font.fontRegular,
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: 6,
  },
  bottomBarBase: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    // paddingBottom is now dynamic via bottomBarStyle
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || "#DDD",
    elevation: 5,
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
