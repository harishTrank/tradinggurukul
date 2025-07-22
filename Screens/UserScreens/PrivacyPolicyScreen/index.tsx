import React from "react";
import { View, StyleSheet, ScrollView, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HTML from "react-native-render-html"; // Import react-native-render-html
import theme from "../../../utils/theme";
import HomeHeader from "../../Components/HomeHeader";
import { useGetallContent } from "../../../hooks/Others/query";

const PrivacyPolicyScreen = ({ navigation }: any) => {
  const getAllContent: any = useGetallContent();
  const privacyData = getAllContent?.data?.privacyPage?.[0];
  const insets = useSafeAreaInsets();

  const renderContent = () => {
    if (!privacyData) {
      return <Text>Loading Privacy Policy...</Text>;
    }
    const {
      bannerHeading,
      privacyEditorField,
    } = privacyData;

    return (
      <>
        {bannerHeading && <Text style={styles.bannerHeading}>{bannerHeading}</Text>}

        <HTML source={{ html: privacyEditorField || "<p>No content available.</p>" }}
          contentWidth={360}
          tagsStyles={{
            p: { fontFamily: 'Arial', fontSize: 16, lineHeight: 24, color: theme.colors.black, marginBottom: 10 },
            h3: { fontFamily: 'Arial-BoldMT', fontSize: 20, color: theme.colors.primary, marginTop: 20, marginBottom: 10 },
            ul: { marginBottom: 10, marginLeft: 20 },
            li: { fontFamily: 'Arial', fontSize: 16, lineHeight: 24, color: theme.colors.black },
            a: { color: theme.colors.secondary, textDecorationLine: 'underline' }
          }}
        />
      </>
    );
  };

  return (
    <View
      style={[styles.parentContainer, { paddingTop: insets.top }]}
    >
      <View style={styles.headerWrapper}>
        <HomeHeader
          onMenuPress={navigation.toggleDrawer}
          onCartPress={() => navigation.navigate("CartScreen")}
          navigation={navigation}
        />
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
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
    paddingHorizontal: 20, // Add horizontal padding
  },
  contentContainer: {
    paddingBottom: 20, // Add padding at the bottom
  },
  headerWrapper: {
    backgroundColor: theme.colors.primary,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  bannerHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  contentWrapper: {
    padding: 16,
  },
});

export default PrivacyPolicyScreen;