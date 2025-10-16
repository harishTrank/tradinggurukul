import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommunityPostCard from "../../CommunityScreen/Components/CommunityPostCard";
import HomeHeader from "../../../Components/HomeHeader";
import theme from "../../../../utils/theme";
import {
  communityLink,
  postsBlogAndCommunityCall,
} from "../../../../store/Services/Others";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../../JotaiStore";

const CommunityMainScreen = ({ navigation }: any) => {
  const [userDetails] = useAtom(userDetailsGlobal);
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [communityLinkData, setCommunityLinkData]: any = useState({});

  // const perPage = 10;

  // const fetchPosts = async (isInitialLoad = false) => {
  //   try {
  //     if (isInitialLoad) setLoading(true);
  //     else setLoadingMore(true);

  //     const res: any = await postsBlogAndCommunityCall({
  //       query: {
  //         page,
  //         per_page: perPage,
  //         category: "community",
  //       },
  //     });

  //     const newPosts = res?.posts || [];

  //     setPosts((prev) => (page === 1 ? newPosts : [...prev, ...newPosts]));
  //     setHasMore(newPosts.length === perPage);
  //   } catch (err) {
  //     console.log("Fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPosts(true);
  // }, [page]);

  // const handleReadMore = (postId: string) => {
  //   navigation.navigate("CommunityReadScreen", { postId });
  // };

  // const handlePostPress = (postId: string) => {
  //   navigation.navigate("CommunityReadScreen", { postId });
  // };

  // const loadMorePosts = () => {
  //   if (!loadingMore && hasMore) {
  //     setPage((prev) => prev + 1);
  //   }
  // };

  // const renderFooter = () =>
  //   loadingMore ? (
  //     <View style={{ paddingVertical: 20 }}>
  //       <ActivityIndicator color={theme.colors.primary} />
  //     </View>
  //   ) : null;

  // const renderCommunityPost = ({ item }: any) => (
  //   <CommunityPostCard
  //     post={item}
  //     onReadMore={handleReadMore}
  //     onPress={handlePostPress}
  //   />
  // );

  useEffect(() => {
    setLoading(true);
    communityLink({
      query: {
        user_id: userDetails?.id,
      },
    })
      .then((res) => {
        setCommunityLinkData(res);
      })
      .catch((err) => {
        console.log("Community err", err);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <SafeAreaView style={[styles.safeArea]}>
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Community</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          // <FlatList
          //   data={posts}
          //   renderItem={renderCommunityPost}
          //   keyExtractor={(item) => item.id}
          //   style={styles.list}
          //   contentContainerStyle={styles.listContentContainer}
          //   showsVerticalScrollIndicator={false}
          //   onEndReached={loadMorePosts}
          //   onEndReachedThreshold={0.5}
          //   ListFooterComponent={renderFooter}
          //   ListEmptyComponent={
          //     <View style={styles.emptyBox}>
          //       <Text style={styles.emptyText}>There is no Community!</Text>
          //     </View>
          //   }
          // />
          <View style={{ flex: 1, marginTop: 20 }}>
            {communityLinkData?.has_purchased ? (
              <View style={styles.container}>
                <Image
                  source={require("../../../../assets/Images/whatsapp.png")} // use a WhatsApp icon
                  style={styles.icon}
                />
                <Text style={styles.infoText}>
                  🎉 You’re now part of our learning community!{"\n"}
                  Tap below to join our official WhatsApp group and connect with
                  other passionate learners.
                </Text>

                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => {
                    const link = communityLinkData?.group_link;
                    if (link) {
                      Linking.openURL(link).catch(() =>
                        alert("Unable to open WhatsApp. Please try again.")
                      );
                    } else {
                      alert("Community link not available.");
                    }
                  }}
                >
                  <Text style={styles.whatsappButtonText}>
                    Join Our WhatsApp Community
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.container}>
                <Image
                  source={require("../../../../assets/Images/locked.jpg")} // use a lock or course-related icon
                  style={styles.icon}
                />
                <Text style={styles.text}>
                  🚀 You haven’t enrolled in any courses yet.{"\n"}
                  Start your learning journey today and gain access to our
                  vibrant WhatsApp community!
                </Text>
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() =>
                    navigation.navigate("Home", { screen: "HomeBottom" })
                  }
                >
                  <Text style={styles.enrollButtonText}>Explore Courses</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: theme.colors.red,
    ...theme.font.fontMedium,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  infoText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 25,
    lineHeight: 24,
    fontWeight: "500",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
  text: {
    color: "#444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 25,
    lineHeight: 24,
  },
  enrollButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "80%",
    elevation: 3,
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});

export default CommunityMainScreen;
