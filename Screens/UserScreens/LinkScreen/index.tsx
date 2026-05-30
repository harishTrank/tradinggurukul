import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import { importantLinksAPI } from "../../../store/Services/Others";

const LinkScreen = ({ navigation }: any) => {
  const [importantLinks, setImportantLinks]: any = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    importantLinksAPI()
      .then((res: any) => {
        setImportantLinks(res?.links || []);
      })
      .catch((err: any) => {
        console.log("Links err", JSON.stringify(err));
      });
  }, []);

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.url)}
      activeOpacity={0.8}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("FeedbackFormScreen")}
      activeOpacity={0.8}
    >
      <Text style={styles.cardText}>Feedback Form</Text>
    </TouchableOpacity>
  );

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

      <View style={styles.container}>
        <Text style={styles.title}>Important Links</Text>

        <FlatList
          data={importantLinks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default LinkScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: 18,
    marginVertical: 8,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.primary || "#007AFF",
    ...theme.font.fontMedium,
  },
});
