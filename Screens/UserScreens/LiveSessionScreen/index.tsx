import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import { getLiveSessionsApi } from "../../../store/Services/Others";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

const getYouTubeId = (url: string): string | null => {
  const match = url?.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const LiveBadge = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.liveBadge, { opacity }]}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </Animated.View>
  );
};

const SessionCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const isLive = item.status === "1";
  const videoId = getYouTubeId(item.link);
  const thumbUri =
    item.thumbnail ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.thumbnailContainer}>
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
        )}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        {isLive && (
          <View style={styles.badgeWrapper}>
            <LiveBadge />
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const LiveSessionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(() => {
    setLoading(true);
    getLiveSessionsApi()
      .then((res: any) => {
        if (res?.data) {
          setSessions(res.data);
        }
      })
      .catch((err: any) => console.log("live session error", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCardPress = (item: any) => {
    navigation.navigate("LiveSessionPlayerScreen", { session: item });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onCartPress={() => navigation.navigate("CartScreen")}
      />

      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Live Sessions</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No sessions available</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SessionCard item={item} onPress={() => handleCardPress(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default LiveSessionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  titleRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.text,
    ...theme.font.fontBold,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: "hidden",
    ...theme.elevationLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.lightGrey,
  },
  thumbnailPlaceholder: {
    backgroundColor: theme.colors.lightGrey,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 4,
  },
  badgeWrapper: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53E3E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#fff",
    marginRight: 5,
  },
  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: theme.colors.text,
    ...theme.font.fontMedium,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 12,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
});
