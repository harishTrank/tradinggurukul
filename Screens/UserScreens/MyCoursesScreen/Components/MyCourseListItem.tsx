import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";
import Feather from "@expo/vector-icons/Feather";
interface Course {
  id: string;
  courseName: string;
  courseFeatImgUrl: string;
  authorName: string;
  start_date: string;
}

interface MyCourseListItemProps {
  course: Course;
  onPress: (courseId: string) => void;
  onPlayPress: (courseId: string) => void;
}

const MyCourseListItem: React.FC<MyCourseListItemProps> = ({
  course,
  onPress,
  onPlayPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(course.id)}
      activeOpacity={0.8}
    >
      {course?.courseFeatImgUrl && (
        <Image
          source={{ uri: course?.courseFeatImgUrl }}
          style={styles.courseImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.detailsContainer}>
        <View style={styles.textInfoContainer}>
          <Text style={styles.courseNameText} numberOfLines={2}>
            {course?.courseName}
          </Text>
          <Text style={styles.instructorText}>
            COURSE BY: {course?.authorName?.toUpperCase()}
          </Text>
          <Text style={styles.dateText}>START DATE: {course?.start_date}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={(e) => {
              e.stopPropagation();
              onPlayPress(course.id);
            }}
            activeOpacity={0.7}
          >
            <Feather
              name="play-circle"
              size={16}
              color={theme.colors.black}
              style={styles.playIcon}
            />
            <Text style={styles.playButtonText}>Play video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  courseImage: {
    width: 125,
    height: 85,
    borderRadius: 8,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  textInfoContainer: {},
  courseNameText: {
    fontSize: 16,
    color: theme.colors.black,
    ...(theme.font.fontBold || { fontWeight: "bold" }),
    marginBottom: 6,
  },
  instructorText: {
    fontSize: 14,
    color: theme.colors.black,
    ...(theme.font.fontMedium || { fontWeight: "500" }),
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.black,
    ...(theme.font.fontMedium || { fontWeight: "500" }),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  playIcon: {
    marginRight: 5,
  },
  playButtonText: {
    fontSize: 13,
    color: theme.colors.black,
    ...(theme.font.fontMedium || { fontWeight: "500" }),
  },
});

export default MyCourseListItem;
