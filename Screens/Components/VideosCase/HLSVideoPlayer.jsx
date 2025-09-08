import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import Video from "react-native-video";

const { width } = Dimensions.get("window");
const height = (width * 9) / 16; // 16:9 ratio

const HLSVideoPlayer = ({ videoUrl }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        controls   // native controls
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={(error) => {
          console.warn("HLS Player error:", error);
          setLoading(false);
        }}
        paused={false}   // autoplay
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loading: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HLSVideoPlayer;
