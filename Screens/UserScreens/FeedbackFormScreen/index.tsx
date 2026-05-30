import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import theme from "../../../utils/theme";
import { feedbackFormAPI } from "../../../store/Services/Others";
import { userDetailsGlobal } from "../../../JotaiStore";
import { useAtom } from "jotai";
import Toast from "react-native-toast-message";

const FeedbackFormScreen = ({ navigation }: any) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [userDetails] = useAtom(userDetailsGlobal);

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (message === "" || rating === 0) {
      Toast.show({
        type: "error",
        text1: "Please provide a rating and enter a feedback message.",
      });
      return;
    }
    feedbackFormAPI({
      body: {
        user_id: userDetails?.id,
        message: message,
        rating: rating,
      },
    })
      .then((res: any) => {
        Toast.show({
          type: "success",
          text1: "Feedback submitted successfully",
        });
        setRating(0);
        setMessage("");
        navigation.goBack();
      })
      .catch((err: any) => {
        Toast.show({
          type: "error",
          text1: "Error submitting form, Try again later",
        });
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.infoText}>
        We’d love to hear from you! Please rate your experience and let us know
        how we can improve our app. Your suggestions and feedback help us make
        the app better for everyone.
      </Text>
      <Text style={styles.label}>Rate your experience</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Feather
              name={star <= rating ? "star" : "star"}
              size={32}
              color={star <= rating ? "#FFD700" : "#ccc"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Your Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginVertical: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  star: {
    marginHorizontal: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 120,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 25,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
