// src/screens/Doubts/DoubtsScreen.js

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
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import theme from "../../../utils/theme";

const initialDoubts = [
  {
    id: "d1",
    sender: "admin",
    text: "Feel free to ask any doubts you have about this topic!",
    timestamp: "1:10 PM",
  },
  {
    id: "d2",
    sender: "user",
    text: "What is the difference between state and props?",
    timestamp: "1:12 PM",
  },
  {
    id: "d3",
    sender: "admin",
    imageUrl: "https://imgs.search.brave.com/r3OfxCZdaQbkqQ2CFUqMxH6iBGFuXauM_O4t2v21k2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMnNs/Y3cza2lwNnFtay5j/bG91ZGZyb250Lm5l/dC9tYXJrZXRpbmcv/cGFnZXMvY2hhcnQv/c2VvL2RhdGEtZmxv/dy1kaWFncmFtL2Rp/c2NvdmVyeS9kYXRh/LWZsb3ctZGlhZ3Jh/bS00LnN2Zw",
    text: "This diagram should help clarify it.",
    timestamp: "1:15 PM",
  },
];

const MessageItem = ({ message, isSentByCurrentUser }) => {
  const containerStyle = isSentByCurrentUser
    ? [styles.messageContainerBase, styles.userMessageContainer]
    : [styles.messageContainerBase, styles.adminMessageContainer];

  return (
    <View style={containerStyle}>
      {!isSentByCurrentUser && <Text style={styles.senderName}>Admin</Text>}
      {message.imageUrl && (
        <Image
          source={{ uri: message.imageUrl }}
          style={styles.chatImage}
          resizeMode="cover"
        />
      )}
      {message.text && <Text style={styles.messageText}>{message.text}</Text>}
      <Text
        style={[
          styles.timestamp,
          { color: isSentByCurrentUser ? "#66776b" : "#999" },
        ]}
      >
        {message.timestamp}
      </Text>
    </View>
  );
};

const DoubtsScreen = ({ route, navigation }) => {
  const { videoId, videoTitle } = route.params;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const currentUserRole = "user";
  const [messages, setMessages] = useState(initialDoubts);
  const [newMessage, setNewMessage] = useState("");

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        const source = { uri: response.assets[0].uri };
        const messageToSend = {
          id: Math.random().toString(),
          sender: currentUserRole,
          imageUrl: source.uri,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, messageToSend]);
      }
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const messageToSend = {
      id: Math.random().toString(),
      sender: currentUserRole,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, messageToSend]);
    setNewMessage("");
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
          <Text style={styles.headerTitle}>Ask a Doubt</Text>
          <Text style={styles.headerSubtitle}>{videoTitle}</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={60}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageItem
              message={item}
              isSentByCurrentUser={item.sender === currentUserRole}
            />
          )}
          keyExtractor={(item) => item.id}
          style={[styles.messageList, { paddingTop: 80 + insets.top }]}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 10 },
          ]}
        >
          <TouchableOpacity
            onPress={handleImagePick}
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
            onPress={handleSendMessage}
          >
            <Icon name="send" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginLeft: 16,
  },
  headerSubtitle: { color: theme.colors.white, fontSize: 12, marginLeft: 16 },
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
  chatImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 5 },
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
});

export default DoubtsScreen;
