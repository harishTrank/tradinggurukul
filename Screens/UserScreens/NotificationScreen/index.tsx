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
import theme from "../../../utils/theme"; 
import HomeHeader from "../../Components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetNotificationListApi } from "../../../hooks/Others/query";
import { useAtom } from "jotai";
import { unReadNotificationGlobal, userDetailsGlobal } from "../../../JotaiStore";
import NotificationItem, { Notification } from "./Component/NotificationItem";
import { readAllNotificationApi } from "../../../store/Services/Others";

const PER_PAGE = 15; 

const NotificationScreen = () => {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();
  const [userDetails] = useAtom(userDetailsGlobal);
  const [,setNotiCount] = useAtom(unReadNotificationGlobal);

  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const notificationListApi: any = useGetNotificationListApi({
    query: {
      user_id: userDetails?.id,
      page: page,
      per_page: PER_PAGE,
    },
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
          ?.then((res) => setNotiCount(0))
          ?.catch((err) => console.log("err", err));
      }
    };
    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
  }, [navigation, userDetails]);

  useEffect(() => {
    if (notificationListApi.data?.notifications) {
      const newNotifications = notificationListApi.data.notifications;
      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }
      if (newNotifications.length === 0 || newNotifications.length < PER_PAGE) {
        setHasMoreData(false);
      }

      setIsFetchingMore(false);
    }
  }, [notificationListApi.data]); 
  const handleLoadMore = () => {
    if (!isFetchingMore && hasMoreData && !notificationListApi.isFetching) {
      setIsFetchingMore(true); 
      setPage((prevPage) => prevPage + 1); 
    }
  };

  const handleRefresh = () => {
    setHasMoreData(true); 
    setPage(1); 
    if (page === 1) {
      notificationListApi.refetch();
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem item={item} />
  );

  const renderFooter = () => {
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
    if (notificationListApi.isLoading) return null;
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

      {notificationListApi.isLoading && page === 1 && (
        <View style={styles.fullScreenLoaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {(!notificationListApi.isLoading || page > 1) && (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
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
    paddingTop: 50, 
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
