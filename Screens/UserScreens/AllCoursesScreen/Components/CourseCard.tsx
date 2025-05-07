// src/components/CourseCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // For stars
import theme from "../../../../utils/theme";
export interface Course {
  id: string;
  title: string;
  imageUrl: any; // Can be require() or { uri: string }
  rating: number;
  reviews: string; // e.g., "(551)"
  price: string; // e.g., "₹999"
}

interface CourseCardProps {
  item: Course;
  onPress: (id: string) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 22.5; // (Screen width / 2 columns) - (horizontal padding + margin)

const CourseCard: React.FC<CourseCardProps> = ({ item, onPress }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon
            key={`star-${i}`}
            name="star"
            size={16}
            color={theme.colors.warning}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Icon
            key={`star-${i}`}
            name="star-half-full"
            size={16}
            color={theme.colors.warning}
          />
        );
      } else {
        stars.push(
          <Icon
            key={`star-${i}`}
            name="star-outline"
            size={16}
            color={theme.colors.warning}
          />
        );
      }
    }
    return stars;
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={item.imageUrl} style={styles.courseImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          {renderStars(item.rating)}
          <Text style={styles.reviewsText}>{item.reviews}</Text>
        </View>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    margin: 7.5, // This creates 15px between cards
    elevation: 3,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden", // Ensures content respects border radius
  },
  courseImage: {
    width: "100%",
    height: 120, // Adjust as needed
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    ...theme.font.fontMedium,
    fontSize: 14,
    color: theme.colors.black,
    marginBottom: 5,
    minHeight: 36, // Approx 2 lines height
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    ...theme.font.fontRegular,
    fontSize: 12,
    color: theme.colors.greyText,
    marginRight: 4,
  },
  reviewsText: {
    ...theme.font.fontRegular,
    fontSize: 12,
    color: theme.colors.greyText,
    marginLeft: 4,
  },
  priceText: {
    ...theme.font.fontSemiBold,
    fontSize: 16,
    color: theme.colors.primary, // Or your theme's price color
  },
});

export default CourseCard;
