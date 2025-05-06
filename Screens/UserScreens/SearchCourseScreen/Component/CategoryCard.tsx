// components/CategoryCard.tsx

import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  Dimensions,
} from "react-native";
import theme from "../../../../utils/theme";

const { width } = Dimensions.get("window");

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  style?: object;
  cardWidth?: number;
  cardHeight?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  imageUrl,
  onPress,
  style,
  cardWidth,
  cardHeight,
}: any) => {
  const defaultWidth = width * 0.42;
  const defaultHeight = 100;

  const finalWidth = cardWidth ?? defaultWidth;
  const finalHeight = cardHeight ?? defaultHeight;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { width: finalWidth, height: finalHeight }, style]}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={imageUrl}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: theme.colors.lightGrey,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  imageStyle: {},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: theme.colors.white,
    ...theme.font.fontSemiBold,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});

export default CategoryCard;
