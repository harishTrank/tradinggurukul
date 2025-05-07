// components/CartItem.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";
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

interface CartItemData {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  price: number;
}

interface CartItemProps {
  item: CartItemData;
  onRemove: (itemId: string) => void;
  onPress?: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onPress,
}: any) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress ? () => onPress(item.id) : undefined}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Image source={item.imageUrl} style={styles.courseImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
          <Text style={styles.ratingCount}>({item.ratingCount})</Text>
        </View>
        <Text style={styles.priceText}>₹ {item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.removeButton}
      >
        <Feather name="trash-2" size={20} color={theme.colors.greyText} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: theme.colors.lightGrey,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 15,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: 5,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  priceText: {
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
    alignSelf: "center",
  },
});

export default CartItem;
