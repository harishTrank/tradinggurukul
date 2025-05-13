import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { WebView } from "react-native-webview";
import { frontend_url } from "../../../utils/api/apiUtils";
import theme from "../../../utils/theme";

const WebVideoPlayer = ({ videoUrl }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const injectedJs = `
    var attempts = 0;
    function setupFullscreenListener() {
      var videoElement = document.querySelector('.video-js video') || document.getElementById('vjs_video_3'); // Try a class selector first, then ID
      var controlBar = document.querySelector('.vjs-control-bar');

      if (videoElement && controlBar) {
        controlBar.addEventListener('touchstart', function() {
          // Using a small delay to allow the class change to propagate
          setTimeout(function() {
            if (videoElement.classList.contains('vjs-fullscreen') || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
              window.ReactNativeWebView.postMessage("fs-active");
            } else {
              window.ReactNativeWebView.postMessage("fs-inactive");
            }
          }, 300); // Adjust delay if needed
        });
        // console.log('Video.js fullscreen listener attached.');
      } else {
        attempts++;
        if (attempts < 20) { // Try for ~5 seconds (20 * 250ms)
          // console.log('Video.js elements not found, retrying... Attempt: ' + attempts);
          setTimeout(setupFullscreenListener, 250);
        } else {
          // console.warn('Failed to attach Video.js fullscreen listener after multiple attempts.');
          // Optionally, post a message back if elements are never found:
          // window.ReactNativeWebView.postMessage("error-video-elements-not-found");
        }
      }
    }
    setupFullscreenListener();
    true; // Required for injectedJavaScript
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        injectedJavaScript={injectedJs}
        allowsFullscreenVideo={true}
        source={{
          uri: `${frontend_url}/app-video?url=${videoUrl}`,
        }}
        style={{ flex: 1 }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
          setIsLoading(false);
        }}
        onMessage={async (event) => {
          const message = event.nativeEvent.data;
          console.log("WebView Message:", message);

          try {
            if (message === "fs-active") {
              await ScreenOrientation.unlockAsync();
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
              );
            } else if (message === "fs-inactive") {
              await ScreenOrientation.unlockAsync();
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
              );
            }
          } catch (e) {
            console.error("Screen orientation change failed:", e);
          }
        }}
      />

      {isLoading ? (
        <View style={styles.loadWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  loadWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 1,
  },
});

export default WebVideoPlayer;
