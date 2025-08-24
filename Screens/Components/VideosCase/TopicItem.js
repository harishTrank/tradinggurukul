import React from "react";
// Make sure to import TouchableOpacity if it's not already there
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "./IconNB";
import theme from "../../../utils/theme";

// Add a new prop 'onDownloadPress' to handle the icon tap
const TopicItem = ({
  data,
  isPreview,
  handlePreview,
  sectionId,
  onDownloadPress,
}) => {
  const onPreviewClick = () => {
    // This function for playing videos remains the same
    const dataToSend = {
      title: data.topicTitle,
      data: data.topicPreview.previewData,
      type: data.topicType,
      id: data.id,
      sectionId,
    };
    handlePreview(dataToSend);
  };

  return (
    <View style={styles.parentTopic}>
      <Icon
        type="MaterialIcons"
        name={data.topicType === "video" ? "videocam" : "article"} // 'article' is a good alternative to 'content-paste'
        color={theme.colors.black}
        size={24}
      />
      <View style={styles.topicContentWrap}>
        <Text style={styles.topicTxt}>{data.topicTitle}</Text>
        <View style={styles.topicMeta}>
          <Text style={styles.topicType}>{data.topicType} - </Text>
          <Text style={styles.topicType}>{data.topicDuration}</Text>
        </View>
      </View>

      {/* Conditionally render a download button if studyDoc exists */}
      {data?.studyDoc ? (
        <TouchableOpacity onPress={onDownloadPress} style={styles.iconButton}>
          <Icon
            type="MaterialIcons"
            name="file-download" // A clear icon for downloading
            color={theme.colors.primary}
            size={26}
          />
        </TouchableOpacity>
      ) : null}

      {/* Your existing preview play button logic */}
      {isPreview ? (
        <TouchableOpacity onPress={onPreviewClick} style={styles.iconButton}>
          <Icon
            type="MaterialIcons"
            name="play-circle-outline"
            color={theme.colors.secondary} // I used secondary color from your commented out code
            size={26}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parentTopic: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    marginBottom: 16,
  },
  topicMeta: {
    flexDirection: "row",
  },
  topicTxt: {
    color: theme.colors.text,
    fontSize: 14,
    paddingBottom: 4,
    ...theme.font.fontSemiBold,
  },
  topicContentWrap: {
    paddingStart: 12, // Increased padding
    flex: 1,
  },
  topicType: {
    color: theme.colors.text,
    textTransform: "capitalize",
    fontSize: 12,
    ...theme.font.fontRegular,
  },
  // Re-using a style for both icon buttons
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

// Add a default prop for the new handler to prevent errors
TopicItem.defaultProps = {
  handlePreview: () => {},
  onDownloadPress: () => {},
};

export default TopicItem;
