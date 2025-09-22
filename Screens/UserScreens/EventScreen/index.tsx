import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventCard from "./Components/EventCard";
import { eventsApi } from "../../../store/Services/Others";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";

const EventScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [loading, setLoading] = useState(false);
  const [eventResponse, setEventResponse]: any = useState({});

  useEffect(() => {
    setLoading(true);
    eventsApi({
      query: {
        user_id: userDetails?.id,
      },
    })
      .then((res: any) => {
        setEventResponse(res);
      })
      .catch((err: any) => {
        console.log("event error", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Events</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView style={styles.container}>
            <Text style={styles.eventDayText}>Today</Text>
            <View>
              {eventResponse?.today_events?.length > 0 ? (
                eventResponse?.today_events?.map((event: any, idx: any) => (
                  <EventCard key={idx} event={event} />
                ))
              ) : (
                <View>
                  <Text style={styles.noEventText}>No Events for Today</Text>
                </View>
              )}
            </View>
            <Text style={styles.eventDayText}>Upcoming Events</Text>
            <View>
              {eventResponse?.upcoming_events?.length > 0 ? (
                eventResponse?.upcoming_events?.map((event: any, idx: any) => (
                  <EventCard key={idx} event={event} />
                ))
              ) : (
                <View>
                  <Text style={styles.noEventText}>No Upcoming Events</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventScreen;

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
  },
  list: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 10,
  },
  eventDayText: {
    fontSize: 16,
    marginVertical: 20,
    color: "#000",
    fontWeight: "600",
  },
  noEventText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 20,
  },
});
