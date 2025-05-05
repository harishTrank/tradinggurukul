import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";

const { width } = Dimensions.get("window");

const CourseCard = ({ title, imageUrl, rating, ratingCount, onPress }: any) => {
  const renderStars = () => {
    let stars = [];
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++)
      stars.push(
        <Feather
          key={`full_${i}`}
          name="star"
          size={16}
          color={theme.colors.orange}
        />
      );
    if (halfStar)
      stars.push(
        <Feather key="half" name="star" size={16} color={theme.colors.orange} />
      );
    for (let i = 0; i < emptyStars; i++)
      stars.push(
        <Feather
          key={`empty_${i}`}
          name="star"
          size={16}
          color={theme.colors.lightGrey}
        />
      ); // Use a lighter grey for empty

    return stars;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        {renderStars()}
        <Text style={styles.ratingCount}>({ratingCount})</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    borderRadius: 10,
    marginBottom: 15,
    marginRight: 15,
    backgroundColor: theme.colors.white,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: 5,
    minHeight: 35, // Ensure space for two lines
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 13,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
    marginLeft: 5,
  },
});

export default CourseCard;
