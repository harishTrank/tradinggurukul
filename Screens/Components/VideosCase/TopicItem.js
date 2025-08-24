// TopicItem.js

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "./IconNB"; // Assuming this is your custom Icon component
import theme from "../../../utils/theme";

const TopicItem = ({
  data,
  isPreview,
  handlePreview,
  sectionId,
  onDownloadPress,
  onCommentPress,
  onDoubtPress,
}) => {
  const onPreviewClick = () => {
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
        name={data.topicType === "video" ? "videocam" : "article"}
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

      {/* Container for all action icons */}
      <View style={styles.actionsContainer}>
        {/* Preview Play Button */}
        {isPreview && (
          <TouchableOpacity onPress={onPreviewClick} style={styles.iconButton}>
            <Icon
              type="MaterialIcons"
              name="play-circle-outline"
              color={theme.colors.secondary}
              size={26}
            />
          </TouchableOpacity>
        )}

        {/* Ask a Doubt Button */}
        {data.topicType === "video" && (
          <TouchableOpacity onPress={onDoubtPress} style={styles.iconButton}>
            <Icon
              type="MaterialIcons"
              name="help-outline"
              color={theme.colors.primary}
              size={24}
            />
          </TouchableOpacity>
        )}

        {/* Comments Button */}
        {data.topicType === "video" && (
          <TouchableOpacity onPress={onCommentPress} style={styles.iconButton}>
            <Icon
              type="MaterialCommunityIcons"
              name="comment-text-outline"
              color={theme.colors.primary}
              size={24}
            />
          </TouchableOpacity>
        )}

        {/* Download Button */}
        {data.studyDoc && (
          <TouchableOpacity onPress={onDownloadPress} style={styles.iconButton}>
            <Icon
              type="MaterialIcons"
              name="file-download"
              color={theme.colors.primary}
              size={26}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentTopic: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingStart: 12,
    flex: 1, // This is important to push the icons to the right
  },
  topicType: {
    color: theme.colors.text,
    textTransform: "capitalize",
    fontSize: 12,
    ...theme.font.fontRegular,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    paddingLeft: 10, // Gives space between icons
  },
});

TopicItem.defaultProps = {
  handlePreview: () => {},
  onDownloadPress: () => {},
  onCommentPress: () => {},
  onDoubtPress: () => {},
};

export default TopicItem;
