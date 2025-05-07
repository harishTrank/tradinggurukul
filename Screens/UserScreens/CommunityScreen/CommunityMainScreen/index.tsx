// screens/CommunityScreen.tsx

import React from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import CommunityPostCard from "../Components/CommunityPostCard";
import HomeHeader from "../../../Components/HomeHeader";
import theme from "../../../../utils/theme";

const communityPostsData = [
  {
    id: "post1",
    title: "Group Student Study",
    imageUrl: require("../../../../assets/Images/dummy1.png"),
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text eve.",
    date: "Jan 25, 2025",
  },
  {
    id: "post2",
    title: "Group Student Study",
    imageUrl: require("../../../../assets/Images/dummy1.png"),
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text eve.",
    date: "Jan 26, 2025",
  },
  {
    id: "post3",
    title: "New Course Announcement",
    imageUrl: require("../../../../assets/Images/dummy1.png"),
    description:
      "Exciting news! A new course on Advanced AI is launching next month. Stay tuned for more details and early bird discounts.",
    date: "Jan 27, 2025",
  },
];

const CommunityMainScreen = ({ navigation }: any) => {
  const handleReadMore = (postId: string) => {
    console.log("Read More for Post:", postId);
    navigation.navigate("ReadMoreScreen", { postId });
  };

  const handlePostPress = (postId: string) => {
    console.log("Post Card Pressed:", postId);
    // handleReadMore(postId);
  };

  const renderCommunityPost = ({
    item,
  }: {
    item: (typeof communityPostsData)[0];
  }) => (
    <CommunityPostCard
      post={item}
      onReadMore={handleReadMore}
      onPress={handlePostPress}
    />
  );

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
        <Text style={styles.screenTitle}>Community</Text>

        <FlatList
          data={communityPostsData}
          renderItem={renderCommunityPost}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
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
    paddingBottom: 10,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingTop: 10,
  },
});

export default CommunityMainScreen;
