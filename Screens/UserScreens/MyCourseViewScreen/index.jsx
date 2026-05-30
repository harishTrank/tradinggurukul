import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import theme from "../../../utils/theme";
import TopicSection from "../../Components/VideosCase/TopicSection";
import { isEmptyObj } from "../../../utils/extra/UserUtils";
import WebVideoPlayer from "../../Components/VideosCase/WebVideoPlayer";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import {
  donwloadCertificate,
  getCourseMyDetailsCall,
} from "../../../store/Services/Others";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HLSVideoPlayer from "../../Components/VideosCase/HLSVideoPlayer";
import CommentsScreen from "../CommentsScreen";
import DoubtsScreen from "../DoubtsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

const ListItem = (props) => {
  return (
    <View style={styles.listItemCont}>
      <TopicSection sectionData={props.item} activeTopic={props.activeTopic} />
    </View>
  );
};

const TopicsTab = ({ coursesData, pdfLink }) => {
  const downloadCertificate = async () => {
    try {
      if (!pdfLink) {
        Alert.alert(
          "No certificate available",
          "Please complete the course to unlock the certificate."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + "certificate.pdf";
      const { uri } = await FileSystem.downloadAsync(pdfLink, fileUri);

      await Print.printAsync({ uri, orientation: Print.Orientation.landscape });
    } catch (error) {
      console.log("Error downloading certificate:", error);
      Alert.alert("Error", "Could not open the certificate for printing.");
    }
  };
  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.topicInfoWrap}>
          {coursesData.activeTopic !== null ? (
            <Text style={styles.topicTitleTxt}>
              {coursesData.activeTopic.title}
            </Text>
          ) : null}
        </View>
      }
      data={coursesData.data}
      renderItem={({ item, index }) => (
        <ListItem
          item={{ ...item, ind: index }}
          activeTopic={
            item.sectionId === coursesData.activeTopic.sectionId
              ? coursesData.activeTopic.id
              : null
          }
        />
      )}
      keyExtractor={(item, index) => `${item.sectionId}-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadCertificate}
          >
            <Text style={styles.downloadText}>Print Certificate</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const CourseDetailScreen = ({ route, navigation }) => {
  const Tab = createMaterialTopTabNavigator();
  const [currentUser] = useAtom(userDetailsGlobal);
  const topic = useSelector((state) => state.topic);
  const [pdfLink, setPdfLink] = React.useState(null);

  const [coursesData, setCoursesData] = React.useState({
    data: null,
    activeTopic: null,
  });

  React.useEffect(() => {
    setCoursesData({
      ...coursesData,
      activeTopic: topic.activeTopic,
    });
  }, [topic]);

  const { prodId, subId } = route.params;

  React.useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      if (currentUser === null || !subId) {
        navigation.goBack();
      }
      let res = await getCourseMyDetailsCall({
        query: {
          sub_id: subId,
          user_id: currentUser.id,
        },
      });

      if (!isEmptyObj(res) && res.sectionTopic.length > 0) {
        setCoursesData({
          ...coursesData,
          data: res.sectionTopic,
          activeTopic: {
            title: res.sectionTopic[0].sectionTopics[0].topicTitle,
            data: res.sectionTopic[0].sectionTopics[0].topicPreview.previewData,
            type: res.sectionTopic[0].sectionTopics[0].topicType,
            id: res.sectionTopic[0].sectionTopics[0].id,
            sectionId: res.sectionTopic[0].sectionId,
          },
        });
      } else {
        setCoursesData({
          ...coursesData,
          data: [],
        });
      }
    } catch (error) {
      console.log("course detail error", error);
    }
  };

  const playerRender = () => {
    if (coursesData.activeTopic !== null) {
      if (coursesData.activeTopic.type === "video") {
        if (coursesData.activeTopic.data.includes("youtu")) {
          return <WebVideoPlayer videoUrl={coursesData.activeTopic.data} />;
        } else {
          return <HLSVideoPlayer videoUrl={coursesData.activeTopic.data} />;
        }
      } else if (coursesData.activeTopic.type === "content") {
        return <ContentPlayer data={coursesData.activeTopic.data} />;
      } else {
        return (
          <Text style={{ color: theme.colors.text }}>Invalid Content</Text>
        );
      }
    }
  };

  React.useEffect(() => {
    donwloadCertificate({
      body: {
        user_id: currentUser.id,
        course_id: prodId,
      },
    })
      .then((res) => {
        setPdfLink(res.url);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  return (
    <View
      style={[styles.parentContainer, { paddingTop: useSafeAreaInsets().top }]}
    >
      {coursesData.data !== null ? (
        coursesData.data.length > 0 ? (
          <>
            <View style={styles.playerWrap}>{playerRender()}</View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Tab.Navigator
                screenOptions={{
                  tabBarActiveTintColor: "#fff",
                  tabBarInactiveTintColor: "#000",
                  tabBarStyle: {
                    backgroundColor: "gray",
                  },
                  tabBarIndicatorStyle: {
                    backgroundColor: "#42BE5C",
                    height: 3,
                  },
                  tabBarLabelStyle: { fontSize: 16, fontWeight: "500" },
                }}
              >
                <Tab.Screen name="Topics">
                  {() => (
                    <TopicsTab coursesData={coursesData} pdfLink={pdfLink} />
                  )}
                </Tab.Screen>

                <Tab.Screen name="Comments">
                  {() => (
                    <CommentsScreen
                      navigation={navigation}
                      route={{
                        params: {
                          videoId: coursesData.activeTopic?.id,
                          videoTitle: coursesData.activeTopic?.title,
                        },
                      }}
                    />
                  )}
                </Tab.Screen>

                <Tab.Screen name="Doubts">
                  {() => (
                    <DoubtsScreen
                      navigation={navigation}
                      route={{
                        params: {
                          videoId: coursesData.activeTopic?.id,
                          videoTitle: coursesData.activeTopic?.title,
                        },
                      }}
                    />
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </KeyboardAvoidingView>
          </>
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: theme.colors.lightGray, fontSize: 16 }}>
              No topics available.
            </Text>
          </View>
        )
      ) : (
        <View style={styles.loadWrap}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  playerWrap: {
    height: 250,
  },
  scrollWrap: {
    flex: 1,
    flexGrow: 1,
  },
  headerWrapper: {
    backgroundColor: theme.colors.secondary,
  },
  topicInfoWrap: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  topicTitleTxt: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  topNavigatorView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  navigatorButton: {
    paddingVertical: 5,
    width: "30%",
    backgroundColor: "gray",
    borderRadius: 20,
    alignItems: "center",
  },
  navigatorText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 16,
  },
  activeNavigatorButton: {
    backgroundColor: "#42BE5C", // Active tab background color
  },
  activeNavigatorText: {
    color: "#fff", // White text for selected tab
  },
  footerContainer: {
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    backgroundColor: "#42BE5C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CourseDetailScreen;
