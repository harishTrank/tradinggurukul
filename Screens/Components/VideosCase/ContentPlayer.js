import React from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import theme from "../../../utils/theme";

const width = Dimensions.get("window").width;

const tagsStyles = {
  body: {
    whiteSpace: "normal",
    color: theme.colors.text,
    padding: "10px 16px",
    backgroundColor: "#f2f2f2",
  },
  a: {
    color: theme.colors.primary,
  },
};

const ContentPlayer = ({ data }) => {
  return (
    <ScrollView style={StyleSheet.parentContainer}>
      <RenderHtml
        contentWidth={width}
        source={{ html: data }}
        tagsStyles={tagsStyles}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

export default ContentPlayer;
