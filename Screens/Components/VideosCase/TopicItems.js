import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // <-- Import useNavigation
import { changeTopic } from "../../../VideoRedux/topic.actions";
import TopicItem from "./TopicItem";
import theme from "../../../utils/theme";

const TopicItems = ({ topicData, activeTopic, sectionId }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // <-- Get navigation object

  // This handler is for changing the main video
  const handleVideoChange = (topicInfo) => {
    // Check if it's a video and has playable data
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

  // NEW: This handler is for opening the study material preview
  const handleDownloadPreview = (topicInfo) => {
    if (topicInfo?.studyDoc) {
      navigation.navigate("PdfPreview", {
        pdfUrl: topicInfo.studyDoc,
        title: topicInfo.topicTitle,
      });
    }
  };

  const renderTopics = () => {
    return topicData.map((el) => (
      // The TouchableOpacity now handles video changes
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
            // Pass the new handler to the TopicItem component
            onDownloadPress={() => handleDownloadPreview(el)}
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
    paddingTop: 16, // This comes from your original code
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  noLectureText: {
    padding: 20,
    textAlign: "center",
    color: theme.colors.grey,
  },
});

export default TopicItems;
