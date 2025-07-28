import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import theme from "../../../../utils/theme";
import { changeTopic } from "../../../../VideoRedux/topic.actions";
import Accordian from "./Accordian";
import TopicItem from "../../../Components/VideosCase/TopicItem";

const TopicList = ({ topicList, isPreview, navigation }) => {
  const dispatch = useDispatch();

  const handlePreview = (topicInfo) => {
    dispatch(changeTopic(topicInfo));
    navigation.navigate("PreviewTopicScreen");
  };

  const renderTopics = (arr, sectionId) => {
    return arr.map((el) => {
      const dataToSend = {
        title: el.topicTitle,
        data:
          isPreview && el.topicPreview !== null
            ? el.topicPreview.previewData
            : null,
        type: el.topicType,
        id: el.id,
        sectionId,
      };
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={el.id}
          disabled={!(isPreview && el.topicPreview !== null)}
          onPress={() =>
            isPreview && el.topicPreview !== null
              ? handlePreview(dataToSend)
              : false
          }
        >
          <TopicItem
            data={el}
            key={el.id}
            isPreview={isPreview && el.topicPreview !== null}
            handlePreview={handlePreview}
            sectionId={sectionId}
          />
        </TouchableOpacity>
      );
    });
  };

  const renderList = (arr) => {
    return arr.map((el) => (
      <Accordian key={el.sectionId} title={el.sectionTitle} data="Test data">
        {renderTopics(el.sectionTopics, el.sectionId)}
      </Accordian>
    ));
  };

  return (
    <View style={styles.parentContainer}>
      {/* <Accordian title="Test Acc" data="Test data" /> */}
      <Text style={styles.topicHead}>Course Content</Text>
      {topicList?.[0]?.sectionMeta?.sectionVideos && (
        <Text style={styles.durationsText}>
          Total Videos: {topicList?.[0]?.sectionMeta?.sectionVideos}
        </Text>
      )}
      {topicList?.[0]?.sectionMeta?.sectionDuration && (
        <Text style={styles.durationsText}>
          {/* Course Duration: {`${topicList?.[0]?.sectionMeta?.sectionDuration?.split(":")?.[0]}Hours ${topicList?.[0]?.sectionMeta?.sectionDuration?.split(":")?.[1]}Minutes ${topicList?.[0]?.sectionMeta?.sectionDuration?.split(":")?.[2]}Seconds`} */}
          Course Duration: {topicList?.[0]?.sectionMeta?.sectionDuration}
        </Text>
      )}
      {renderList(topicList)}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  topicHead: {
    fontSize: 14,
    paddingHorizontal: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    lineHeight: 18,
    color: theme.colors.text,
    paddingBottom: 8,
  },
  durationsText: {
    fontSize: 14,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 18,
    color: theme.colors.text,
    paddingBottom: 8,
  },
});

TopicList.defaultProps = {
  isPreview: false,
  topicList: [],
};

export default TopicList;
