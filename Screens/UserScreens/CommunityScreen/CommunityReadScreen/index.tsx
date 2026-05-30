// Screens/UserScreens/ReadMoreScreen.tsx
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Feather";
import theme from "../../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostsBlogAndCommunityCall } from "../../../../hooks/Others/query";
import RenderHTML from "react-native-render-html";
import FullScreenLoader from "../../../Components/FullScreenLoader";

const CommunityReadScreen = ({ navigation, route }: any) => {
  const fetchParticularPost: any = usePostsBlogAndCommunityCall({
    query: {
      id: route?.params?.postId,
    },
  });
  return (
    <SafeAreaView style={[styles.safeArea]}>
      {fetchParticularPost?.isLoading && <FullScreenLoader />}
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Details
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {fetchParticularPost?.data?.posts?.[0]?.image && (
          <Image
            source={{ uri: fetchParticularPost?.data?.posts?.[0]?.image }}
            style={styles.postImage}
          />
        )}
        <View style={styles.contentPadding}>
          <Text style={styles.postTitle}>
            {fetchParticularPost?.data?.posts?.[0]?.title || ""}
          </Text>
          <Text style={styles.postDate}>
            {fetchParticularPost?.data?.posts?.[0]?.date || ""}
          </Text>
          <RenderHTML
            contentWidth={300}
            source={{
              html: `<div>${
                fetchParticularPost?.data?.posts?.[0]?.content || ""
              }</div>`,
            }}
            baseStyle={styles.htmlContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey || "#ECECEC",
    backgroundColor: theme.colors.white,
  },
  backButton: {
    padding: 5,
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    textAlign: "center",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 30,
  },
  htmlContent: {
    fontSize: 14,
    color: theme.colors.black,
    ...theme.font.fontRegular,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postTitle: {
    fontSize: 24,
    color: theme.colors.black,
    ...theme.font.fontBold,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 14,
    color: theme.colors.grey || "#888888",
    ...theme.font.fontRegular,
    marginBottom: 15,
  },
  postDescription: {
    fontSize: 16,
    color: theme.colors.text || theme.colors.black,
    ...theme.font.fontRegular,
    lineHeight: 24,
  },
});

export default CommunityReadScreen;
