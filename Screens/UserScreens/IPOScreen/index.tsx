import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getIPODetails } from "../../../store/Services/Others";

const dummyIPOs = [
  {
    id: "1",
    company: "ABC Technologies Ltd",
    openDate: "2025-10-05",
    closeDate: "2025-10-07",
    priceRange: "₹100 - ₹120",
    lotSize: "50 Shares",
    ipoType: "Mainboard",
    minInvestment: "₹15,000",
    recommendationPerc: "85%",
    gmp: "₹40",
    status: "Open",
  },
  {
    id: "2",
    company: "XYZ Fintech Pvt Ltd",
    openDate: "2025-10-10",
    closeDate: "2025-10-12",
    priceRange: "₹250 - ₹280",
    lotSize: "30 Shares",
    ipoType: "SME",
    minInvestment: "₹10,000",
    recommendationPerc: "72%",
    gmp: "₹15",
    status: "Upcoming",
  },
  {
    id: "3",
    company: "DEF Pharma Ltd",
    openDate: "2025-09-20",
    closeDate: "2025-09-22",
    priceRange: "₹500 - ₹550",
    lotSize: "20 Shares",
    ipoType: "Mainboard",
    minInvestment: "₹20,000",
    recommendationPerc: "90%",
    gmp: "₹60",
    status: "Closed",
  },
];

const IPOScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [ipos, setIPOs]: any = useState([]);

  useEffect(() => {
    setLoading(true);
    getIPODetails()
      .then((res: any) => {
        setIPOs(res);
      })
      .catch((err: any) => {
        console.log("IPO Errr", JSON.stringify(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const renderIPOCard = ({ item }: any) => (
    <View style={styles.card}>
      {/* Company + Status Row */}
      <View style={styles.rowBetween}>
        <Text style={styles.companyName}>{item.company}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Open"
              ? { color: "green" }
              : item.status === "Upcoming"
              ? { color: "#E6B800" }
              : { color: "red" },
          ]}
        >
          {item.status}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.detailRow}>
        <Text style={styles.detail}>IPO Type</Text>
        <Text style={styles.value}>{item.ipoType}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Open</Text>
        <Text style={styles.value}>{item.openDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Close</Text>
        <Text style={styles.value}>{item.closeDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Listing</Text>
        <Text style={styles.value}>{item.listingDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Price Range</Text>
        <Text style={styles.value}>{item.priceRange}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Lot Size</Text>
        <Text style={styles.value}>{item.lotSize}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Min Investment</Text>
        <Text style={styles.value}>{item.minInvestment}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>GMP</Text>
        <Text style={styles.value}>{item.gmp}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Recommendation</Text>
        <Text style={styles.value}>{item.recommendationPerc}</Text>
      </View>
    </View>
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

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>IPOs</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : ipos.length > 0 ? (
          <FlatList
            data={ipos}
            keyExtractor={(item) => item.id}
            renderItem={renderIPOCard}
            contentContainerStyle={{ padding: 15 }}
            ListFooterComponent={
              <Text style={styles.disclaimer}>
                Note: The IPO data shown here may not be accurate. Please verify
                from official sources before making any investment decisions.
              </Text>
            }
          />
        ) : (
          <Text style={styles.noEventText}>No IPO Detail available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default IPOScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  noEventText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 50,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  detail: {
    fontSize: 14,
    color: "#000",
    fontWeight: "800",
  },
  value: {
    fontSize: 14,
    color: "#444 ",
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    fontStyle: "italic",
  },
});
