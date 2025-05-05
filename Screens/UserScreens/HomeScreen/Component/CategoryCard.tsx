import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
} from "react-native";
import theme from "../../../../utils/theme";

const CategoryCard = ({ title, imageUrl, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageBackground
        source={imageUrl}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150, // Adjust width
    height: 130, // Adjust height
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 15, // Space between cards
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: theme.colors.white,
    ...theme.font.fontMedium,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CategoryCard;
