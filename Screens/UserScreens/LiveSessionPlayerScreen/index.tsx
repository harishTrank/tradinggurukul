import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
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

const formatPrice = (value: any): string => {
  if (value === undefined || value === null || value === "") return "";
  const str = String(value).trim();
  if (str.includes("₹")) return str;
  return str.startsWith("-") ? `-₹${str.slice(1)}` : `₹${str}`;
};

const TradeResultSection = ({ result }: { result: any }) => {
  const isProfit = String(result?.result_status).toLowerCase() === "profit";
  const isBuy = String(result?.trade_taken).toUpperCase() === "BUY";
  const images: string[] = Array.isArray(result?.images) ? result.images : [];
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Trade Result</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: isProfit ? "#1FA855" : theme.colors.blue },
          ]}
        >
          <Text style={styles.statusPillText}>
            {String(result?.result_status || "").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.resultStatsRow}>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatLabel}>Trade Taken</Text>
          <View
            style={[
              styles.tradeTakenPill,
              {
                backgroundColor: isBuy
                  ? theme.colors.primary
                  : theme.colors.red,
              },
            ]}
          >
            <Text style={styles.tradeTakenText}>{result?.trade_taken}</Text>
          </View>
        </View>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatLabel}>Entry Price</Text>
          <Text style={styles.resultStatValue}>
            {formatPrice(result?.entry_price)}
          </Text>
        </View>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatLabel}>Exit Price</Text>
          <Text style={styles.resultStatValue}>
            {formatPrice(result?.exit_price)}
          </Text>
        </View>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatLabel}>P&L</Text>
          <Text
            style={[
              styles.resultStatValue,
              { color: isProfit ? "#1FA855" : theme.colors.red },
            ]}
          >
            {formatPrice(result?.profit_loss)}
          </Text>
        </View>
      </View>

      {result?.analysis_description ? (
        <View style={styles.resultDescriptionBox}>
          <Text style={styles.resultDescriptionLabel}>Analysis</Text>
          <Text style={styles.resultDescriptionText}>
            {result.analysis_description}
          </Text>
        </View>
      ) : null}

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resultImagesRow}
        >
          {images.map((uri, index) => (
            <TouchableOpacity
              key={`${uri}-${index}`}
              activeOpacity={0.85}
              onPress={() => setPreviewUri(uri)}
            >
              <Image
                source={{ uri }}
                style={styles.resultImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {result?.analysis_date ? (
        <Text style={styles.resultAnalysisDate}>
          Analyzed on{" "}
          {new Date(result.analysis_date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      ) : null}

      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setPreviewUri(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="x" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.previewImageWrap}
            activeOpacity={1}
            onPress={() => setPreviewUri(null)}
          >
            {previewUri && (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const LiveSessionPlayerScreen = ({ navigation, route }: any) => {
  const { session } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoId = (session?.link).split("/").reverse()[0];

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
            <Feather
              name="alert-circle"
              size={40}
              color={theme.colors.greyText}
            />
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

        {session?.result ? (
          <TradeResultSection result={session.result} />
        ) : null}
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
  resultCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  resultTitle: {
    fontSize: 16,
    color: theme.colors.text,
    ...theme.font.fontSemiBold,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resultStatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  resultStatBox: {
    minWidth: "21%",
    flexGrow: 1,
  },
  resultStatLabel: {
    fontSize: 11,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginBottom: 4,
  },
  resultStatValue: {
    fontSize: 14,
    color: theme.colors.text,
    ...theme.font.fontSemiBold,
  },
  tradeTakenPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tradeTakenText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resultDescriptionBox: {
    marginBottom: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  resultDescriptionLabel: {
    fontSize: 11,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    marginBottom: 4,
  },
  resultDescriptionText: {
    fontSize: 13,
    color: theme.colors.text,
    ...theme.font.fontRegular,
    lineHeight: 19,
  },
  resultImagesRow: {
    gap: 10,
    marginBottom: 12,
  },
  resultImage: {
    width: 160,
    height: 110,
    borderRadius: 8,
    backgroundColor: theme.colors.grey,
  },
  resultAnalysisDate: {
    fontSize: 11,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  previewImageWrap: {
    width: "100%",
    height: "80%",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
});
