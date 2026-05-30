// TopicItem.js

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
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
  notPurchase,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const dotsIconRef = useRef(null);

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

  const openMenu = () => {
    dotsIconRef.current.measure((fx, fy, width, height, px, py) => {
      // Position the menu right below the icon
      // right is calculated from the right edge of the screen
      setMenuPosition({
        top: py + height,
        right: Dimensions.get("window").width - px - width,
      });
      setMenuVisible(true);
    });
  };

  const renderMenuItem = (label, handler) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        handler();
        setMenuVisible(false);
      }}
    >
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  // Determine if any action is available to show the three-dot icon
  const isAnyActionAvailable = data.topicType === "video" || data.studyDoc;

  return (
    <>
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

        {/* Actions Container */}
        <View style={styles.actionsContainer}>
          {isPreview && (
            <TouchableOpacity
              onPress={onPreviewClick}
              style={styles.iconButton}
            >
              <Icon
                type="MaterialIcons"
                name="play-circle-outline"
                color={theme.colors.secondary}
                size={26}
              />
            </TouchableOpacity>
          )}

          {/* Three Dots Menu Icon */}
          {isAnyActionAvailable && !notPurchase && (
            <TouchableOpacity
              ref={dotsIconRef}
              onPress={openMenu}
              style={styles.iconButton}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="dots-vertical"
                color={theme.colors.grey}
                size={24}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pop-up Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.menuContainer, menuPosition]}>
              {data.topicType === "video" &&
                renderMenuItem("Ask a Doubt", onDoubtPress)}
              {data.topicType === "video" &&
                renderMenuItem("Comments", onCommentPress)}
              {data.studyDoc &&
                renderMenuItem("Download Material", onDownloadPress)}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
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
    flex: 1,
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
    paddingLeft: 10,
  },
  // --- New styles for the menu ---
  modalOverlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#eee",
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 14,
    color: theme.colors.text,
    ...theme.font.fontRegular,
  },
});

TopicItem.defaultProps = {
  handlePreview: () => {},
  onDownloadPress: () => {},
  onCommentPress: () => {},
  onDoubtPress: () => {},
};

export default TopicItem;
