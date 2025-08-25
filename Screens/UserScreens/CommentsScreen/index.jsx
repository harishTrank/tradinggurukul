// src/screens/Comments/CommentsScreen.js

import React, { useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../../../utils/theme";
import {
  useAddCommentApi,
  useAddCommentReplyApi,
} from "../../../hooks/Others/mutation";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { useGetAllCommentsApi } from "../../../hooks/Others/query";

const {width} = Dimensions.get("window");

const ReplyItem = ({ reply }) => (
  <View style={styles.replyContainer}>
    {/* Inverted list renders upside down, so we apply a transform to flip it back */}
    <View>
      <Text style={styles.commentUser}>{reply.user}</Text>
      <Text style={styles.commentText}>{reply.text}</Text>
      <Text style={styles.commentTimestamp}>{reply.timestamp}</Text>
    </View>
  </View>
);

const CommentItem = ({ comment, onReplyPress }) => (
  <View style={styles.commentWrapper}>
    {/* Inverted list renders upside down, so we apply a transform to flip it back */}
    <View>
      <View style={styles.commentContainer}>
        <Text style={styles.commentUser}>{comment.user}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
          <TouchableOpacity onPress={() => onReplyPress(comment)}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesList}>
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </View>
      )}
    </View>
  </View>
);

const CommentsScreen = ({ route, navigation }) => {
  const { videoId, videoTitle } = route.params;
  const insets = useSafeAreaInsets();
  const textInputRef = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [userDetails] = useAtom(userDetailsGlobal);

  const addCommentApiCall = useAddCommentApi();
  const addCommentReplyApiCall = useAddCommentReplyApi();
  const getAllComments = useGetAllCommentsApi({
    query: {
      topic_id: videoId,
      page: 1,
      limit: 50,
    },
  });

  const formatApiComment = (apiComment) => {
    const isCurrentUser = apiComment.user_id === userDetails?.id?.toString();
    const date = new Date(apiComment.created_at.replace(" ", "T") + "Z");
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

    return {
      id: apiComment.id,
      user: isCurrentUser ? "You" : `User ${apiComment.user_id}`,
      text: apiComment.comment,
      timestamp: `${formattedDate}, ${formattedTime}`,
      replies: apiComment.replies
        ? apiComment.replies.map(formatApiComment)
        : [],
    };
  };

  const comments = useMemo(() => {
    if (getAllComments.data?.data?.comments) {
      // With an inverted list, we do NOT reverse the data.
      // The API returns newest first, which is what inverted needs.
      return getAllComments.data.data.comments.map(formatApiComment);
    }
    return [];
  }, [getAllComments.data, userDetails?.id]);

  const handleSend = () => {
    if (newComment.trim() === "" || !userDetails?.id) return;

    const onSettled = () => {
      setNewComment("");
      setReplyingTo(null);
      textInputRef.current?.blur();
      getAllComments.refetch();
    };

    const onError = (err) => {
      console.error("Error posting:", err);
    };

    if (replyingTo) {
      addCommentReplyApiCall.mutate(
        {
          body: {
            comment_id: replyingTo.id,
            user_id: userDetails.id,
            topic_id: videoId,
            reply: newComment.trim(),
          },
        },
        { onSettled, onError }
      );
    } else {
      addCommentApiCall.mutate(
        {
          body: {
            topic_id: videoId,
            comment: newComment.trim(),
            user_id: userDetails.id,
          },
        },
        { onSettled, onError }
      );
    }
  };

  const handleReplyPress = (comment) => {
    setReplyingTo(comment);
    textInputRef.current?.focus();
  };
  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderContent = () => {
    if (getAllComments.isLoading && !getAllComments.data) {
      return (
        <View style={styles.centerMessage}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (getAllComments.isError) {
      return (
        <View style={styles.centerMessage}>
          <Text>Failed to load comments. Please try again.</Text>
        </View>
      );
    }

    if (comments.length === 0) {
      return (
        <View style={styles.centerMessage}>
          <Text>No comments yet. Be the first to comment!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentItem comment={item} onReplyPress={handleReplyPress} />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list} // The list itself needs to be inverted
        // Padding is added to the content container to create space for the header and input
        contentContainerStyle={{
          paddingTop: 10, // Visual bottom of the list
          paddingBottom: 80 + insets.top, // Visual top of the list (space for header)
        }}
        inverted // This is the key change!
      />
    );
  };

  return (
    <View style={styles.container}>
      {addCommentApiCall.isLoading || addCommentReplyApiCall.isLoading ? (
        <FullScreenLoader />
      ) : null}

      {/* The header is absolutely positioned and stays on top */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={26} color={theme.colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Comments</Text>
          <Text style={styles.headerSubtitle}>{videoTitle}</Text>
        </View>
      </View>

      {/* The FlatList now sits directly inside the main view */}
      {renderContent()}

      {/* The KeyboardAvoidingView now ONLY wraps the input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 10 },
          ]}
        >
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>
                Replying to {replyingTo.user}
              </Text>
              <TouchableOpacity onPress={cancelReply}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Add a public comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (addCommentApiCall.isLoading ||
                  addCommentReplyApiCall.isLoading) &&
                  styles.disabledSendButton,
              ]}
              onPress={handleSend}
              disabled={
                addCommentApiCall.isLoading || addCommentReplyApiCall.isLoading
              }
            >
              <Icon name="send" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5DDD5" },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    zIndex: 10,
    elevation: 4,
  },
  backButton: { padding: 10 },
  headerTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerSubtitle: {
    color: theme.colors.white,
    fontSize: 12,
    marginLeft: 10,
    width: width - 80,
  },
  // The list style now applies the transform to flip the entire list
  list: { flex: 1, paddingHorizontal: 16 },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  commentWrapper: { marginVertical: 8 },
  commentContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
  },
  commentUser: { fontWeight: "bold", color: "#333", marginBottom: 4 },
  commentText: { fontSize: 15, color: "#444", lineHeight: 22 },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  commentTimestamp: { fontSize: 11, color: "#888" },
  replyButtonText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  repliesList: {
    marginTop: 10,
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#e0e0e0",
    paddingLeft: 10,
  },
  replyContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  replyingToContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#f1f1f1",
  },
  replyingToText: { color: "#666", fontSize: 13 },
  inputRow: { flexDirection: "row", alignItems: "center", padding: 8 },
  textInput: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: "#cccccc",
  },
});

export default CommentsScreen;
