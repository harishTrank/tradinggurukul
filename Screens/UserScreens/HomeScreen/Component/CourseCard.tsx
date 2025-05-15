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
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const CourseCard = ({
  title,
  imageUrl,
  tag,
  price,
  regular_price,
  onPress,
}: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.priceBox}>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.regularPrice}>₹{regular_price}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.tag}>{tag}</Text>
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
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    fontSize: 10,
    ...theme.font.fontSemiBold,
    padding: 2,
  },
  priceBox: {
    flexDirection: "row",
    marginVertical: 3,
  },
  price: {
    color: theme.colors.black,
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
});

export default CourseCard;
