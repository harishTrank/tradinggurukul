import React, { useState, useRef, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import theme from "../../../utils/theme";

const HLSPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This effect handles screen orientation when the component unmounts.
  // It's a crucial cleanup step to prevent the app from being stuck in landscape mode.
  useEffect(() => {
    return () => {
      // On unmount, unlock the orientation and set it back to portrait
      ScreenOrientation.unlockAsync().then(() => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      });
    };
  }, []);

  const handleFullscreenUpdate = async (event) => {
    // This event is fired when the native fullscreen player is presented or dismissed.
    const { fullscreenUpdate } = event;

    switch (fullscreenUpdate) {
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
        // Lock the screen to landscape when the player is about to enter fullscreen
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
          );
        } catch (e) {
          console.error("Failed to lock screen to landscape:", e);
        }
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        // Lock the screen back to portrait when the player is about to exit fullscreen
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } catch (e) {
          console.error("Failed to lock screen to portrait:", e);
        }
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{
          uri: videoUrl,
        }}
        useNativeControls // Use the platform's native player controls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            // Once the video is loaded, we can hide the main loader
            if (isLoading) setIsLoading(false);
          }
          if (status.error) {
            // Handle video playback error
            console.error("Video Error:", status.error);
            setError(
              "There was an error loading the video. Please try again."
            );
            setIsLoading(false);
          }
        }}
        onFullscreenUpdate={handleFullscreenUpdate}
        onError={(err) => {
          console.error("Video onError:", err);
          setError("Could not load the video file.");
          setIsLoading(false);
        }}
        // This is a good alternative to onLoadEnd in WebView
        onReadyForDisplay={() => setIsLoading(false)}
      />

      {isLoading && (
        <View style={styles.loadWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {error && !isLoading && (
        <View style={styles.loadWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Good practice to have a black background for video players
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject, // Make the video fill the container
  },
  loadWrap: {
    ...StyleSheet.absoluteFillObject, // Overlay on top of the video
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay for better visibility
  },
  errorText: {
    color: "white",
    fontSize: 16,
    padding: 20,
    textAlign: "center",
  },
});

export default HLSPlayer;