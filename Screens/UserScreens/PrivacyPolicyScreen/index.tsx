import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { frontend_url } from "../../../utils/api/apiUtils";
import theme from "../../../utils/theme";
import HomeHeader from "../../Components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivacyPolicyScreen = ({ navigation }: any) => {
  return (
    <View
      style={[styles.parentContainer, { paddingTop: useSafeAreaInsets().top }]}
    >
      <View style={styles.headerWrapper}>
        <HomeHeader
          onMenuPress={navigation.toggleDrawer}
          onCartPress={() => navigation.navigate("CartScreen")}
          navigation={navigation}
        />
      </View>
      <View style={styles.scrollContainer}>
        <WebView
          source={{ uri: `${frontend_url}/privacy-policy?hideLayout=true` }}
          style={{ flex: 1 }}
          javaScriptEnabled
          originWhitelist={["*"]}
          cacheEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContainer: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    backgroundColor: theme.colors.white,
    marginTop: 20,
  },
  contentWrapper: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: theme.colors.primary,
  },
});

export default PrivacyPolicyScreen;
