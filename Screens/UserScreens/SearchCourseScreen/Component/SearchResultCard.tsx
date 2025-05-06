// components/SearchResultCard.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const formatStudentCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count.toString();
};

interface SearchResult {
  id: string;
  title: string;
  imageUrl: string;
  priceStatus: "Free" | "Paid";
  studentCount: number;
  rating: number;
}

const SearchResultCard = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <Image source={item.imageUrl} style={styles.courseImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.priceStatusText}>{item.priceStatus}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather
              name="users"
              size={14}
              color={theme.colors.greyText}
              style={styles.icon}
            />
            <Text style={styles.statText}>
              {formatStudentCount(item.studentCount)} student
            </Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome
              name="star"
              size={14}
              color={theme.colors.orange}
              style={styles.icon}
            />
            <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
    marginBottom: 1,
  },
  courseImage: {
    width: 85,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: theme.colors.lightGrey,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: 4,
    lineHeight: 20,
  },
  priceStatusText: {
    fontSize: 13,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  icon: {
    marginRight: 4,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
});

export default SearchResultCard;
