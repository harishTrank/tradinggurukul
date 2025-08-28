import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import theme from "../../../utils/theme"; // Adjust path
import HomeHeader from "../../Components/HomeHeader"; // Adjust path
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetNotificationListApi } from "../../../hooks/Others/query";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import NotificationItem, { Notification } from "./Component/NotificationItem"; // Make sure this path is correct
import { readAllNotificationApi } from "../../../store/Services/Others";

type NotificationScreenNavigationProp = StackNavigationProp<any>;

const PER_PAGE = 15; // Set items per page

const NotificationScreen = () => {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();
  const [userDetails] = useAtom(userDetailsGlobal);

  // --- PAGINATION STATES ---
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // ✅ API hook driven by the 'page' state
  const notificationListApi: any = useGetNotificationListApi({
    query: {
      user_id: userDetails?.id,
      page: page,
      per_page: PER_PAGE,
    },
    // The query will be disabled until userDetails.id is available
    enabled: !!userDetails?.id,
  });

  useEffect(() => {
    const onFocus = () => {
      if (userDetails?.id) {
        console.log("Focus listener fired with user ID:", userDetails.id);
        readAllNotificationApi({
          query: {
            user_id: userDetails.id,
          },
        })
          ?.then((res) => console.log("res", res))
          ?.catch((err) => console.log("err", err));
      }
    };
    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
  }, [navigation, userDetails]);

  useEffect(() => {
    if (notificationListApi.data?.notifications) {
      const newNotifications = notificationListApi.data.notifications;

      // If it's the first page, replace the list. Otherwise, append.
      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }

      // Check if there's more data to load
      if (newNotifications.length === 0 || newNotifications.length < PER_PAGE) {
        setHasMoreData(false);
      }

      setIsFetchingMore(false);
    }
  }, [notificationListApi.data]); // This effect runs when new data arrives

  // ✅ This function is called when the user scrolls to the end of the list
  const handleLoadMore = () => {
    // Prevent fetching if already loading, or if there's no more data
    if (!isFetchingMore && hasMoreData && !notificationListApi.isFetching) {
      setIsFetchingMore(true); // Show footer loader
      setPage((prevPage) => prevPage + 1); // Increment page, which triggers the API hook to refetch
    }
  };

  // ✅ This function is called on pull-to-refresh
  const handleRefresh = () => {
    setHasMoreData(true); // Reset pagination state
    setPage(1); // Set page to 1
    // React Query's hook will automatically refetch because the `page` state changed
    // If page was already 1, we should explicitly refetch
    if (page === 1) {
      notificationListApi.refetch();
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem item={item} />
  );

  const renderFooter = () => {
    // Show a spinner at the bottom while loading more pages
    if (!isFetchingMore) return null;
    return (
      <ActivityIndicator
        style={styles.footerLoader}
        size="large"
        color={theme.colors.primary}
      />
    );
  };

  const ListEmptyComponent = () => {
    // Don't show anything while the initial load is happening
    if (notificationListApi.isLoading) return null;

    // Show error message if the fetch failed
    if (notificationListApi.isError) {
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.errorText}>Failed to load notifications.</Text>
          <Button
            title="Retry"
            onPress={() => notificationListApi.refetch()}
            color={theme.colors.primary}
          />
        </View>
      );
    }

    // Show this message if there are no notifications
    if (notifications.length === 0) {
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            You have no notifications yet.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onCartPress={() => navigation.navigate("CartScreen")}
      />
      <Text style={styles.screenTitle}>Notifications</Text>

      {/* Show a full-screen loader ONLY on the initial fetch */}
      {notificationListApi.isLoading && page === 1 && (
        <View style={styles.fullScreenLoaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {/* The FlatList is only shown after the initial load attempt */}
      {(!notificationListApi.isLoading || page > 1) && (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          // Use a unique ID from the item if available, otherwise fallback
          keyExtractor={(item) =>
            item.reply_id ? `reply-${item.reply_id}` : `doubt-${item.doubt_id}`
          }
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={ListEmptyComponent}
          onRefresh={handleRefresh}
          // Show refreshing indicator from React Query's state
          refreshing={notificationListApi.isFetching && page === 1}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  screenTitle: {
    fontSize: 22,
    ...theme.font.fontBold,
    color: theme.colors.black,
    marginLeft: 15,
    marginVertical: 10,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  footerLoader: {
    marginVertical: 20,
  },
  fullScreenLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50, // Give it some space from the top
    paddingHorizontal: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: theme.colors.grey,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default NotificationScreen;
