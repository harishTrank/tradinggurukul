import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import theme from "../../../../utils/theme";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

const EventCardDetail = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { event }: any = route?.params;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View>
            <View style={styles.flexTop}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather
                  name="arrow-left"
                  size={28}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
              <Text style={styles.topTitle}>Hello {event?.greeting}</Text>
              <View />
            </View>
            <Text
              style={{ ...styles.topTitle, fontSize: 16, marginVertical: 10 }}
            >
              You're Invited to our upcoming event
            </Text>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.cardContainer}>
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
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.normalText}>{event?.event_desc}</Text>
                <View style={styles.qrParent}>
                  <View style={styles.qrContainer}>
                    <Image
                      style={styles.qrImage}
                      source={{ uri: event?.qr_url }}
                    />
                  </View>
                  <Text style={styles.normalText}>{event?.ticket_id}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventCardDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  topTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    // minHeight: "100%",
  },
  flexTop: {
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContainer: {
    height: 200,
    width: "100%",
    marginBottom: 10,
    backgroundColor: theme.colors.primary,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  descriptionContainer: {
    paddingHorizontal: 10,
  },
  normalText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  qrParent: {
    marginTop: 20,
    marginBottom: 150,
    alignItems: "center",
  },
  qrContainer: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  qrImage: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
  },
});
