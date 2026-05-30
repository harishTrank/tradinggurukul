import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommunityPostCard from "../../CommunityScreen/Components/CommunityPostCard";
import HomeHeader from "../../../Components/HomeHeader";
import theme from "../../../../utils/theme";
import { postsBlogAndCommunityCall } from "../../../../store/Services/Others";

const BlogMainScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const perPage = 10;

  const fetchPosts = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true);
      else setLoadingMore(true);

      const res: any = await postsBlogAndCommunityCall({
        query: {
          page,
          per_page: perPage,
        },
      });

      const newPosts = res?.posts || [];

      setPosts((prev) => (page === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(newPosts.length === perPage);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [page]);

  const handleReadMore = (postId: string) => {
    navigation.navigate("BlogReadScreen", { postId });
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate("BlogReadScreen", { postId });
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    ) : null;

  const renderCommunityPost = ({ item }: any) => (
    <CommunityPostCard
      post={item}
      onReadMore={handleReadMore}
      onPress={handlePostPress}
    />
  );

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
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Blog</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderCommunityPost}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>There is no blog!</Text>
              </View>
            }
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
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBox: {
    height: 500,
    alignItems:"center",
    justifyContent:"center"
  },
  emptyText: {
    color: theme.colors.red,
    ...theme.font.fontMedium
  }
});

export default BlogMainScreen;
