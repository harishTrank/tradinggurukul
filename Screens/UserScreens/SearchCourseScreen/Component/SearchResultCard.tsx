import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";
import dayjs from "dayjs";
import AntDesign from "@expo/vector-icons/AntDesign";

const SearchResultCard = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      {item?.images?.[0]?.src && (
        <Image
          source={{ uri: item?.images?.[0]?.src }}
          style={styles.courseImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.currentPrice}>₹{item?.price}</Text>
          {item?.regular_price && item?.regular_price !== item?.price && (
            <Text style={styles.regularPrice}>₹{item?.regular_price}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <AntDesign
            name="earth"
            size={18}
            color={theme.colors.text}
            style={styles.icon}
          />
          <Text style={styles.updatedDateText}>
            {`Updated on ${dayjs(item?.date_modified).format("DD-MM-YYYY")}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    marginBottom: 8,
  },
  courseImage: {
    width: 115,
    height: 75,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: theme.colors.lightGrey || "#F0F0F0",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    color: theme.colors.text,
    ...(theme.font.fontSemiBold || { fontWeight: "600" }),
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    color: theme.colors.primary,
    ...(theme.font.fontSemiBold || { fontWeight: "600" }),
    fontSize: 14,
  },
  regularPrice: {
    color: theme.colors.text,
    ...(theme.font.fontMedium || { fontWeight: "500" }),
    fontSize: 14,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  icon: {
    marginRight: 6,
  },
  updatedDateText: {
    color: theme.colors.text,
    ...(theme.font.fontMedium || { fontWeight: "500" }),
    fontSize: 14,
  },
});

export default SearchResultCard;
