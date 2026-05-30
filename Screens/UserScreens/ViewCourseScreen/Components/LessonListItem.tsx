// src/components/LessonListItem.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // For play icon or lesson status
import theme from "../../../../utils/theme";

export interface Lesson {
  id: string;
  title: string;
  lessonNumber: number;
  thumbnailUrl: any;
}

interface LessonListItemProps {
  item: Lesson;
  onPress: (lessonId: string) => void;
}

const LessonListItem: React.FC<LessonListItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <Image source={item.thumbnailUrl} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.lessonNumberText}>Lesson {item.lessonNumber}</Text>
      </View>
      {/* Optional: Add a play or status icon */}
      <Icon
        name="play-circle-outline"
        size={28}
        color={theme.colors.primary}
        style={styles.playIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || "#EEE",
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 6,
    marginRight: 15,
    backgroundColor: theme.colors.grey,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...theme.font.fontMedium,
    fontSize: 15,
    color: theme.colors.black,
    marginBottom: 4,
  },
  lessonNumberText: {
    ...theme.font.fontRegular,
    fontSize: 12,
    color: theme.colors.greyText,
  },
  playIcon: {
    marginLeft: 10,
  },
});

export default LessonListItem;
