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
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import FeatherIcon from "react-native-vector-icons/Feather";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import {
  getCourseDetailsCall,
  getCourseTopicsCall,
} from "../../../store/Services/Others";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import RenderHTML from "react-native-render-html";
import { getProcessedHtml } from "../../../utils/extra/UserUtils";
import TopicList from "./Components/TopicList.js";
import { useAddToCartCall } from "../../../hooks/Others/mutation";
import Toast from "react-native-toast-message";

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

const ViewCourseScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;
  const [course, setCourse]: any = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [topicsData, setTopicsData]: any = useState([]);
  const addTocartApiCall: any = useAddToCartCall();

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
        const subId =
          res?.courseData?.find((item: any) => item?.id === res?.id)
            ?.subscriptionId || undefined;
        if (res?.purchased && res?.id && subId) {
          return navigation.replace("MyCourseViewScreen", {
            prodId: res?.id,
            subId,
          });
        } else {
          getCourseTopicsCall({
            query: {
              course_id: res?.id,
            },
          })
            ?.then((topics: any) => {
              setTopicsData(topics);
            })
            ?.catch((err: any) => console.log("err", err));
        }
      })
      ?.catch((err: any) => console.log("err", JSON.stringify(err)));
  };

  useEffect(() => {
    if (courseId) {
      viewCourseApiCallManager();
    }
  }, [courseId]);

  const handleAddToCart = () => {
    addTocartApiCall
      ?.mutateAsync({
        body: {
          user_id: userDetails?.id,
          id: courseId,
          quantity: 1,
        },
      })
      ?.then((res: any) => {
        if (res?.code == 1) {
          Toast.show({
            type: "success",
            text1: res?.message,
          });
        } else {
          Toast.show({
            type: "error",
            text1: res?.message,
          });
        }
      })
      ?.catch((err: any) => console.log("err", JSON.stringify(err)));
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
          {course?.images?.[0]?.src && (
            <Image
              source={{ uri: course?.images?.[0]?.src }}
              style={styles.videoPreviewImage}
            />
          )}
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
        <View style={[Platform.OS === "android" && { paddingBottom: 50 }]}>
          {topicsData.length > 0 ? (
            <TopicList
              topicList={topicsData}
              isPreview={true}
              navigation={navigation}
            />
          ) : (
            <Text style={styles.noContentTxt}>
              No course content available.
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={bottomBarStyle}>
        <Text style={styles.priceText}>₹{course?.price}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          {addTocartApiCall?.isLoading ? (
            <ActivityIndicator size={"small"} color={theme.colors.white} />
          ) : (
            <Text style={styles.addToCartButtonText}>Add To Cart</Text>
          )}
        </TouchableOpacity>
      </View>
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
      {!isPurchased && renderNotPurchasedView()}
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
  noContentTxt: {
    color: theme.colors.grey,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default ViewCourseScreen;
