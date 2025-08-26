// src/screens/Doubts/DoubtsScreen.js

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../../../utils/theme";
import { useGetAllDoubtsApi } from "../../../hooks/Others/query";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { useAddDoubtApi } from "../../../hooks/Others/mutation";
import FullScreenLoader from "../../Components/FullScreenLoader";
import {
  getfileobj,
  getImage,
  takePicture,
} from "../../../utils/extra/ImagePicker";

const { width } = Dimensions.get("window");

// ✅ Single Message Component
const MessageItem = ({ message, isSentByCurrentUser, onImagePress }) => {
  const containerStyle = message?.isAdmin
    ? [styles.messageContainerBase, styles.adminMessageContainer]
    : [styles.messageContainerBase, styles.userMessageContainer];

  const timestampColor = isSentByCurrentUser ? "#66776b" : "#999";

  return (
    <View style={containerStyle}>
      {/* Show sender name if admin */}
      {!isSentByCurrentUser && message.isAdmin && (
        <Text style={styles.senderName}>Admin</Text>
      )}

      {/* User Doubt */}
      {message.doubt && <Text style={styles.messageText}>{message.doubt}</Text>}

      {/* User Attachment */}
      {message.attachment && (
        <Pressable onPress={() => onImagePress(message.attachment)}>
          <Image
            source={{ uri: message.attachment }}
            style={styles.chatImage}
            resizeMode="cover"
          />
        </Pressable>
      )}

      {/* Admin Answer */}
      {message.answer && (
        <Text style={[styles.messageText, { fontStyle: "italic" }]}>
          {message.answer}
        </Text>
      )}

      {/* Admin Answer Attachment */}
      {message.answer_attachment && (
        <Pressable onPress={() => onImagePress(message.answer_attachment)}>
          <Image
            source={{ uri: message.answer_attachment }}
            style={styles.chatImage}
            resizeMode="cover"
          />
        </Pressable>
      )}

      {/* Timestamp */}
      <Text style={[styles.timestamp, { color: timestampColor }]}>
        {new Date(
          message.created_at.replace(" ", "T") + "Z"
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

const DoubtsScreen = ({ route, navigation }) => {
  const { videoId, videoTitle } = route.params;
  const insets = useSafeAreaInsets();
  const [userDetails] = useAtom(userDetailsGlobal);

  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // --- PAGINATION STATES ---
  const [page, setPage] = useState(1);
  const [messagesList, setMessagesList] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PER_PAGE = 20;

  // ✅ Image Preview State
  const [previewImage, setPreviewImage] = useState(null);

  // API hooks
  const getAllDoubtApi = useGetAllDoubtsApi({
    query: {
      user_id: userDetails?.id,
      topic_id: videoId,
      page,
      per_page: PER_PAGE,
    },
  });

  const addDoubtApi = useAddDoubtApi();

  // ✅ Format API Data
  const formatApiMessages = (apiMessages) => {
    const allMsgs = [];
    apiMessages.forEach((msg) => {
      // User's doubt
      allMsgs.push({
        id: `doubt-${msg.id}`,
        created_at: msg.created_at,
        doubt: msg.doubt,
        attachment: msg.attachment || null,
        isAdmin: false,
        user_id: msg.user_id?.toString(),
      });

      // Admin answer (if exists)
      if (msg.answer || msg.answer_attachment) {
        allMsgs.push({
          id: `answer-${msg.id}`,
          created_at: msg.answered_at || msg.created_at,
          answer: msg.answer,
          answer_attachment: msg.answer_attachment || null,
          isAdmin: true,
          user_id: "1",
        });
      }
    });
    return allMsgs.sort(
      (a, b) =>
        new Date(a.created_at.replace(" ", "T") + "Z") -
        new Date(b.created_at.replace(" ", "T") + "Z")
    );
  };

  // --- UPDATE MESSAGES LIST ON API SUCCESS ---
  useEffect(() => {
    if (getAllDoubtApi.data?.doubts) {
      const newData = formatApiMessages(getAllDoubtApi.data.doubts);

      if (page === 1) {
        setMessagesList(newData.reverse());
      } else {
        setMessagesList((prev) => [...prev, ...newData.reverse()]);
      }

      if (newData.length === 0 || page >= getAllDoubtApi.data.total_page) {
        setHasMore(false);
      }

      setIsFetchingMore(false);
    }
  }, [getAllDoubtApi.data]);

  const handlePickImage = () => {
    Alert.alert("Pick Image", "Choose from camera or gallery", [
      {
        text: "Gallery",
        onPress: () => getImage(setSelectedImage),
        style: "default",
      },
      {
        text: "Camera",
        onPress: async () => await takePicture(setSelectedImage),
        style: "default",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ✅ Send Message with Attachment
  const addDoubtMessageHandler = () => {
    if (!newMessage.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    formData.append("topic_id", videoId);
    formData.append("doubt", newMessage.trim());

    if (selectedImage) {
      console.log('selectedImage', selectedImage)
      formData.append("attachment", getfileobj(selectedImage));
    }

    addDoubtApi.mutate(
      { body: formData },
      {
        onSuccess: () => {
          setNewMessage("");
          setSelectedImage(null);
          setPage(1);
          setHasMore(true);
          setMessagesList([]);
          getAllDoubtApi.refetch();
        },
        onError: (err) => console.error("Error sending doubt:", err),
      }
    );
  };

  const handleLoadMore = () => {
    if (
      !isFetchingMore &&
      hasMore &&
      !getAllDoubtApi.isLoading &&
      page < (getAllDoubtApi.data?.total_page || 1)
    ) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderContent = () => {
    if (getAllDoubtApi.isLoading && page === 1) {
      return (
        <View style={styles.centerMessage}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (getAllDoubtApi.isError && page === 1) {
      return (
        <View style={styles.centerMessage}>
          <Text>Failed to load messages. Please try again.</Text>
        </View>
      );
    }

    if (messagesList.length === 0 && !hasMore) {
      return (
        <View style={styles.centerMessage}>
          <Text>No doubts yet. Be the first to ask!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={messagesList}
        renderItem={({ item }) => (
          <MessageItem
            message={item}
            isSentByCurrentUser={item.user_id === userDetails?.id?.toString()}
            onImagePress={(uri) => setPreviewImage(uri)}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 80 + insets.top,
        }}
        inverted
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      {addDoubtApi.isLoading && <FullScreenLoader />}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={26} color={theme.colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Ask a Doubt</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {videoTitle}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        {renderContent()}

        {/* ✅ Image Preview (before sending) */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.removePreview}
            >
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 10 },
          ]}
        >
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.attachButton}
          >
            <Icon name="attach-file" size={24} color="#555" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type your doubt..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={addDoubtMessageHandler}
            disabled={addDoubtApi.isLoading}
          >
            <Icon name="send" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ✅ Full Screen Image Preview */}
      <Modal visible={!!previewImage} transparent={true}>
        <View style={styles.previewModal}>
          <Image
            source={{ uri: previewImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closePreviewButton}
            onPress={() => setPreviewImage(null)}
          >
            <Icon name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5DDD5" },
  keyboardAvoidingContainer: { flex: 1 },
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
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageContainerBase: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 5,
    maxWidth: "85%",
    elevation: 1,
  },
  adminMessageContainer: {
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
  },
  userMessageContainer: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  senderName: {
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
    fontSize: 13,
  },
  chatImage: { width: 200, height: 200, borderRadius: 8, marginVertical: 5 },
  messageText: { fontSize: 15, color: "#333" },
  timestamp: { fontSize: 11, marginTop: 5, alignSelf: "flex-end" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  attachButton: { padding: 8, marginRight: 4 },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
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
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePreview: {
    marginLeft: 10,
    backgroundColor: "red",
    borderRadius: 12,
    padding: 4,
  },
  previewModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "90%", height: "80%" },
  closePreviewButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
});

export default DoubtsScreen;
