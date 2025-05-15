// components/CartItem.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";

const CartItem: any = ({ item, onRemove, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress ? () => onPress(item.id) : undefined}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {item?.image && (
        <Image source={{ uri: item.image }} style={styles.courseImage} />
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.name}
        </Text>
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>₹ {item?.price}</Text>
          <Text style={styles.regularPriceText}>₹{item?.regular_price}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(item?.cart_item_key)}
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
    width: 140,
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
  priceBox: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginTop: 4,
  },
  regularPriceText: {
    fontSize: 12,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginTop: 4,
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
    alignSelf: "center",
  },
});

export default CartItem;
