// TopicItems.js

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { changeTopic } from "../../../VideoRedux/topic.actions";
import TopicItem from "./TopicItem";
import theme from "../../../utils/theme";

const TopicItems = ({ topicData, activeTopic, sectionId }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleVideoChange = (topicInfo) => {
    if (
      topicInfo.topicType !== "video" ||
      !topicInfo.topicPreview?.previewData
    ) {
      return;
    }
    const dataToSend = {
      title: topicInfo.topicTitle,
      data: topicInfo.topicPreview.previewData,
      type: topicInfo.topicType,
      id: topicInfo.id,
      sectionId,
    };
    dispatch(changeTopic(dataToSend));
  };

  const handleDownloadPreview = (topicInfo) => {
    if (topicInfo?.studyDoc) {
      navigation.navigate("PdfPreview", {
        pdfUrl: topicInfo.studyDoc,
        title: topicInfo.topicTitle,
      });
    }
  };

  const handleCommentPress = (topicInfo) => {
    navigation.navigate("CommentsScreen", {
      videoId: topicInfo.id,
      videoTitle: topicInfo.topicTitle,
    });
  };

  const handleDoubtPress = (topicInfo) => {
    navigation.navigate("DoubtsScreen", {
      videoId: topicInfo.id,
      videoTitle: topicInfo.topicTitle,
    });
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
          <TopicItem
            data={el}
            sectionId={sectionId}
            onDownloadPress={() => handleDownloadPreview(el)}
            onCommentPress={() => handleCommentPress(el)}
            onDoubtPress={() => handleDoubtPress(el)}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  return topicData.length > 0 ? (
    renderTopics()
  ) : (
    <Text style={styles.noLectureText}>No lectures in this section.</Text>
  );
};

const styles = StyleSheet.create({
  topicItemWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  noLectureText: { padding: 20, textAlign: "center", color: theme.colors.grey },
});

export default TopicItems;
