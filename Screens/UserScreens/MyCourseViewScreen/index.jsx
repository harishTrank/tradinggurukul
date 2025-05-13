import axios from "axios";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import theme from "../../../utils/theme";
import TopicSection from "../../Components/VideosCase/TopicSection";
import { isEmptyObj } from "../../../utils/extra/UserUtils";
import WebVideoPlayer from "../../Components/VideosCase/WebVideoPlayer";

const height = Dimensions.get("window").height;

const ListItem = (props) => {
  return (
    <View style={styles.listItemCont}>
      <TopicSection sectionData={props.item} activeTopic={props.activeTopic} />
    </View>
  );
};

const CourseDetailScreen = ({ route, navigation }) => {
  const currentUser = useSelector((state) => state.user.userInfo);
  const topic = useSelector((state) => state.topic);

  const [coursesData, setCoursesData] = React.useState({
    data: null,
    activeTopic: null,
  });

  React.useEffect(() => {
    console.log("Topc change", topic);

    setCoursesData({
      ...coursesData,
      activeTopic: topic.activeTopic,
    });
  }, [topic]);

  const { prodId, subId } = route.params;

  console.log("route.params", route.params);

  React.useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      if (currentUser === null || !subId) {
        navigation.goBack();
      }

      let res = await axios.get(
        `${api_url}/courseDetail?sub_id=${subId}&user_id=${currentUser.id}`
      );
      console.log("User Course Detail res", res.data);

      if (!isEmptyObj(res.data) && res.data.sectionTopic.length > 0) {
        setCoursesData({
          ...coursesData,
          data: res.data.sectionTopic,
          activeTopic: {
            title: res.data.sectionTopic[0].sectionTopics[0].topicTitle,
            data: res.data.sectionTopic[0].sectionTopics[0].topicPreview
              .previewData,
            type: res.data.sectionTopic[0].sectionTopics[0].topicType,
            id: res.data.sectionTopic[0].sectionTopics[0].id,
            sectionId: res.data.sectionTopic[0].sectionId,
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
        return <WebVideoPlayer videoUrl={coursesData.activeTopic.data} />;
      } else if (coursesData.activeTopic.type === "content") {
        return <ContentPlayer data={coursesData.activeTopic.data} />;
      } else {
        return (
          <Text style={{ color: theme.colors.text }}>Invalid Content</Text>
        );
      }
    }
  };

  return (
    <View style={styles.parentContainer}>
      {coursesData.data !== null ? (
        coursesData.data.length > 0 ? (
          <>
            <View style={styles.playerWrap}>{playerRender()}</View>
            <View style={styles.scrollWrap}>
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
                renderItem={({ item, index }) => {
                  console.log("Item", item.sectionId);
                  return (
                    <ListItem
                      item={{ ...item, ind: index }}
                      activeTopic={
                        item.sectionId === coursesData.activeTopic.sectionId
                          ? coursesData.activeTopic.id
                          : null
                      }
                    />
                  );
                }}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollWrap}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
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
  },
  playerWrap: {
    height: 350,
  },
  scrollWrap: {
    flex: 2,
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
});

export default CourseDetailScreen;
