// components/MyCourseListItem.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const renderStars = (rating: number) => {
  let stars = [];
  let fullStars = Math.floor(rating);
  let halfStar = rating % 1 >= 0.5;
  let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const starColor = theme.colors.orange;
  const emptyStarColor = theme.colors.lightGrey;

  for (let i = 0; i < fullStars; i++)
    stars.push(
      <FontAwesome
        key={`full_${i}`}
        name="star"
        size={14}
        color={starColor}
        style={styles.star}
      />
    );
  if (halfStar)
    stars.push(
      <FontAwesome
        key="half"
        name="star-half-empty"
        size={14}
        color={starColor}
        style={styles.star}
      />
    );
  for (let i = 0; i < emptyStars; i++)
    stars.push(
      <FontAwesome
        key={`empty_${i}`}
        name="star-o"
        size={14}
        color={emptyStarColor}
        style={styles.star}
      />
    );

  return stars;
};

interface Course {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  status: "viewed" | "pending";
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
}: any) => {
  const isViewed = course.status === "viewed";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(course.id)}
    >
      <Image source={course.imageUrl} style={styles.courseImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{course.rating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(course.rating)}
          </View>
          <Text style={styles.ratingCount}>({course.ratingCount})</Text>
        </View>
        <View style={styles.statusActionRow}>
          <View style={styles.statusContainer}>
            <Feather
              name={isViewed ? "check-circle" : "clock"}
              size={14}
              color={isViewed ? theme.colors.primary : theme.colors.orange}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>
              {isViewed ? "Viewed" : "View Pending"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={(e) => {
              e.stopPropagation();
              onPlayPress(course.id);
            }}
          >
            <Feather
              name="play-circle"
              size={14}
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 1,
  },
  ratingCount: {
    fontSize: 13,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginLeft: 4,
  },
  statusActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  playIcon: {
    marginRight: 4,
  },
  playButtonText: {
    fontSize: 12,
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
});

export default MyCourseListItem;
