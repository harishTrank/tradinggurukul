import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "./IconNB";
import theme from "../../../utils/theme";

const TopicItem = ({ data, isPreview, handlePreview, sectionId }) => {
  const onPreviewClick = () => {
    const dataToSend = {
      title: data.topicTitle,
      data: data.topicPreview.previewData,
      type: data.topicType,
      id: data.id,
      sectionId,
    };
    console.log("Change", dataToSend);
    handlePreview(dataToSend);
  };

  return (
    <View style={styles.parentTopic}>
      <Icon
        type="MaterialIcons"
        name={data.topicType === "video" ? "videocam" : "content-paste"}
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
      {isPreview ? (
        <View style={styles.playVideoWrap}>
          <Icon
            type="MaterialIcons"
            name="play-circle-outline"
            color={theme.colors.primary}
            size={24}
          />
        </View>
      ) : null}
      {/* {isPreview ? (
        <TouchableOpacity onPress={onPreviewClick}>
          <View style={styles.playVideoWrap}>
            <Icon
              type="MaterialIcons"
              name="play-circle-outline"
              color={theme.colors.secondary}
              size={24}
            />
          </View>
        </TouchableOpacity>
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  parentTopic: {
    flex: 1,
    flexDirection: "row",
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
    paddingStart: 8,
    flex: 1,
  },
  topicType: {
    color: theme.colors.text,
    textTransform: "capitalize",
    fontSize: 12,
    ...theme.font.fontRegular,
  },
  playVideoWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

TopicItem.defaultProps = {
  handlePreview: () => {},
};

export default TopicItem;
