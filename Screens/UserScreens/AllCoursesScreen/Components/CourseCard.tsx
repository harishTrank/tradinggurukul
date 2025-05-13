import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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
const cardWidth = width / 2 - 22.5;

const CourseCard: React.FC<CourseCardProps> = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item?.images?.[0]?.src }}
        style={styles.courseImage}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.tag}>{item?.categories?.[0]?.name}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>₹{item?.price}</Text>
          <Text style={styles.regularPrice}>₹{item?.regular_price}</Text>
        </View>
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
    overflow: "hidden",
    ...theme.elevationLight,
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
    marginBottom: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
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
  priceBox: {
    flexDirection: "row",
    marginVertical: 3,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 15,
    ...theme.font.fontSemiBold,
  },
  regularPrice: {
    color: theme.colors.black,
    fontSize: 14,
    ...theme.font.fontRegular,
    paddingLeft: 5,
    textDecorationLine: "line-through",
  },
  tag: {
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    fontSize: 10,
    ...theme.font.fontSemiBold,
    padding: 2,
  },
});

export default CourseCard;
