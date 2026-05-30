import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import { getNewsDetails } from "../../../store/Services/Others";

const NewsCard = ({ item }: any) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => Linking.openURL(item.referenceLink)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.cardTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={3} style={styles.cardDescription}>
          {item.content}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>
            {new Date(item.date).toDateString()}
          </Text>
          <Text style={styles.readMore}>Read more →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNews = async (pageNum = 1) => {
    if (pageNum > totalPages) return;

    pageNum === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res: any = await getNewsDetails({
        query: {
          page: pageNum,
          per_page: perPage,
        },
      });

      if (res?.news) {
        if (pageNum === 1) {
          setNewsList(res.news);
        } else {
          setNewsList((prev) => [...prev, ...res.news]);
        }
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.log("news error", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Latest News</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : newsList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No news available</Text>
          </View>
        ) : (
          <FlatList
            data={newsList}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }) => <NewsCard item={item} />}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: theme.colors.red,
    ...theme.font.fontMedium,
  },
  // --- News Card Styles ---
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.grey,
    ...theme.font.fontMedium,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardDate: {
    fontSize: 12,
    color: "#555",
  },
  readMore: {
    fontSize: 12,
    color: theme.colors.primary,
    ...theme.font.fontMedium,
  },
});

export default NewsScreen;
