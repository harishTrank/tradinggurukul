import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import Video from "react-native-video";
import * as ScreenOrientation from "expo-screen-orientation";

const { width } = Dimensions.get("window");
const height = (width * 9) / 16; // 16:9 ratio

const HLSVideoPlayer = ({ videoUrl }) => {
  const [loading, setLoading] = useState(true);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      ({ orientationInfo }) => {
        const o = orientationInfo.orientation;
        if (
          o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ) {
          videoRef.current?.presentFullscreenPlayer();
        }
      }
    );
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const enterFullScreen = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } catch (e) {
      console.warn("Failed to lock orientation:", e);
    }
  };

  const exitFullScreen = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );

      // Important: after locking portrait, also unlock so future landscape rotations are detected
      setTimeout(async () => {
        await ScreenOrientation.unlockAsync();
      }, 300);
    } catch (e) {
      console.warn("Failed to unlock orientation:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        controls // native controls
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={(error) => {
          console.warn("HLS Player error:", error);
          setLoading(false);
        }}
        paused={false} // autoplay
        onFullscreenPlayerWillPresent={enterFullScreen}
        onFullscreenPlayerWillDismiss={exitFullScreen}
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HLSVideoPlayer;
