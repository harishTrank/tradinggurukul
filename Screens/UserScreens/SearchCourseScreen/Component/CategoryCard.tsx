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
import { LinearGradient } from "expo-linear-gradient";

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
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientOverlay}
        >
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: theme.colors.white,
  },
  gradientOverlay: {
    width: "100%",
    paddingHorizontal: 8,
    paddingTop: 15,
    paddingBottom: 8,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    objectFit: "contain",
  },
  imageStyle: {
    objectFit: "contain",
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
