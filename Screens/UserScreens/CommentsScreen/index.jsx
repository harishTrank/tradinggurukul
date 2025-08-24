// src/screens/Comments/CommentsScreen.js

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../../../utils/theme";

const initialComments = [
  {
    id: "c1",
    user: "John Doe",
    text: "This was a really helpful video, thank you!",
    timestamp: "10:45 AM",
    replies: [
      {
        id: "r1",
        user: "Admin",
        text: "You're welcome, John!",
        timestamp: "10:50 AM",
      },
      {
        id: "r2",
        user: "Jane Smith",
        text: "I agree, it was great!",
        timestamp: "11:02 AM",
      },
    ],
  },
  {
    id: "c2",
    user: "Jane Smith",
    text: "Can you explain the part at 5:32 again?",
    timestamp: "11:10 AM",
    replies: [],
  },
];

const ReplyItem = ({ reply }) => (
  <View style={styles.replyContainer}>
    <Text style={styles.commentUser}>{reply.user}</Text>
    <Text style={styles.commentText}>{reply.text}</Text>
    <Text style={styles.commentTimestamp}>{reply.timestamp}</Text>
  </View>
);

const CommentItem = ({ comment, onReplyPress }) => (
  <View style={styles.commentWrapper}>
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
    {comment.replies.length > 0 && (
      <View style={styles.repliesList}>
        {comment.replies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} />
        ))}
      </View>
    )}
  </View>
);

const CommentsScreen = ({ route, navigation }) => {
  const { videoId, videoTitle } = route.params;
  const insets = useSafeAreaInsets();
  const textInputRef = useRef(null);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSend = () => {
    if (newComment.trim() === "") return;
    const newReply = {
      id: Math.random().toString(),
      user: "You",
      text: newComment.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    if (replyingTo) {
      const updatedComments = comments.map((c) =>
        c.id === replyingTo.id ? { ...c, replies: [...c.replies, newReply] } : c
      );
      setComments(updatedComments);
    } else {
      setComments([...comments, { ...newReply, replies: [] }]);
    }
    setNewComment("");
    setReplyingTo(null);
  };

  const handleReplyPress = (comment) => {
    setReplyingTo(comment);
    textInputRef.current?.focus();
  };
  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <View style={styles.container}>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <CommentItem comment={item} onReplyPress={handleReplyPress} />
          )}
          keyExtractor={(item) => item.id}
          style={[styles.list, { paddingTop: 80 + insets.top }]}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
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
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
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
    marginLeft: 16,
  },
  headerSubtitle: { color: theme.colors.white, fontSize: 12, marginLeft: 16 },
  list: { flex: 1, paddingHorizontal: 16 },
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
});

export default CommentsScreen;
