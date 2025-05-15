// components/CommunityPostCard.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../utils/theme";
import RenderHTML from "react-native-render-html";

interface PostData {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  date: string;
}

interface CommunityPostCardProps {
  post: PostData;
  onReadMore: (postId: string) => void;
  onPress?: (postId: string) => void;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onReadMore,
  onPress,
}: any) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress ? () => onPress(post.id) : undefined}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {post?.image && (
        <Image source={{ uri: post?.image }} style={styles.postImage} />
      )}
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.description,
            {
              marginBottom: 0,
            },
          ]}
        >
          {post?.category?.[0]?.name}
        </Text>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.clampedHtmlContainer}>
          <RenderHTML
            contentWidth={300}
            source={{ html: `<div>${post.content}</div>` }}
            baseStyle={styles.htmlContent}
          />
        </View>
        <Text style={styles.dateText}>{post?.date}</Text>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => onReadMore(post.id)}
        >
          <Text style={styles.readMoreButtonText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  postImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: theme.colors.lightGrey,
  },
  htmlContent: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    lineHeight: 20,
    marginBottom: 10,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
    lineHeight: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
    marginBottom: 15,
  },
  readMoreButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  readMoreButtonText: {
    fontSize: 13,
    color: theme.colors.white,
    ...theme.font.fontMedium,
  },
  clampedHtmlContainer: {
    maxHeight: 70,
    overflow: "hidden",
  },
});

export default CommunityPostCard;
