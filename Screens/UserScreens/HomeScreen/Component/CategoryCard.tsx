import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../../../utils/theme";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

const CategoryCard = ({ title, imageUrl, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackgroundWrapper}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientOverlay}
        >
          <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 130,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 15,
    elevation: 3,
    shadowColor: theme.colors.white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
  },
  imageBackgroundWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backgroundImageStyle: {
    objectFit: "contain",
  },
  gradientOverlay: {
    width: "100%",
    paddingHorizontal: 8,
    paddingTop: 15,
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 15,
    color: theme.colors.white,
    ...theme.font.fontSemiBold,
    textAlign: "center",
  },
});

export default CategoryCard;
