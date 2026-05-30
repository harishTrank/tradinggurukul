import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const EventCard = ({ event }: any) => {
  const navigation: any = useNavigation();
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("EventCardDetailScreen", { event })}
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={{
          uri: event?.featured_image,
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.eventTitle}>{event?.event_title}</Text>
          <Text style={styles.eventSubTitle}>{event?.subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    width: "100%",
    borderRadius: 40,
    marginBottom: 10,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  textContainer: {
    margin: 20,
  },
  eventTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  eventSubTitle: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
  },
});
