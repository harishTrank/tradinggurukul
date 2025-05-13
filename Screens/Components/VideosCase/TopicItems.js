import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { changeTopic } from "../../../VideoRedux/topic.actions";
import TopicItem from "./TopicItem";
import theme from "../../../utils/theme";

const TopicItems = ({ topicData, activeTopic, sectionId }) => {
  const dispatch = useDispatch();

  const handleVideoChange = (topicInfo) => {
    const dataToSend = {
      title: topicInfo.topicTitle,
      data: topicInfo.topicPreview.previewData,
      type: topicInfo.topicType,
      id: topicInfo.id,
      sectionId,
    };
    console.log("Change", dataToSend);
    dispatch(changeTopic(dataToSend));
  };

  const renderTopics = () => {
    return topicData.map((el) => (
      <TouchableOpacity
        key={el.id}
        activeOpacity={0.8}
        onPress={() => handleVideoChange(el)}
      >
        <View
          style={{
            ...styles.topicItemWrap,
            backgroundColor:
              el.id === activeTopic ? "#f1f1f1" : theme.colors.white,
          }}
        >
          <TopicItem data={el} key={el.id} />
        </View>
      </TouchableOpacity>
    ));
  };

  return topicData.length > 0 ? (
    renderTopics(topicData)
  ) : (
    <Text>No lecture in this section.</Text>
  );
};

const styles = StyleSheet.create({
  topicItemWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default TopicItems;
