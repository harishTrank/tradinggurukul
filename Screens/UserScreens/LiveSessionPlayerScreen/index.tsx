import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../utils/theme";

const { width } = Dimensions.get("window");

const getYouTubeId = (url: string): string | null => {
  const match = url?.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const LiveSessionPlayerScreen = ({ navigation, route }: any) => {
  const { session } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);

  const videoId = getYouTubeId(session?.link);
  const isLive = session?.status === "1";

  const onReady = useCallback(() => {
    setLoading(false);
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={theme.colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {session?.title}
          </Text>
        </View>
        {isLive && (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Player */}
      <View style={styles.playerWrapper}>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        {videoId ? (
          <YoutubePlayer
            height={width * (9 / 16)}
            width={width}
            videoId={videoId}
            play={playing}
            onReady={onReady}
            onChangeState={onStateChange}
            webViewProps={{
              allowsFullscreenVideo: true,
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            initialPlayerParams={{
              modestbranding: true,
              rel: false,
              controls: true,
            }}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={40} color={theme.colors.greyText} />
            <Text style={styles.errorText}>Unable to load video</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <ScrollView contentContainerStyle={styles.infoContainer}>
        <Text style={styles.videoTitle}>{session?.title}</Text>
        <Text style={styles.videoDate}>
          {new Date(session?.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LiveSessionPlayerScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    color: theme.colors.text,
    ...theme.font.fontSemiBold,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53E3E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  liveLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  playerWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    position: "relative",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  infoContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  videoTitle: {
    fontSize: 16,
    color: theme.colors.text,
    ...theme.font.fontSemiBold,
    marginBottom: 6,
  },
  videoDate: {
    fontSize: 13,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
});
