import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetallContent } from "../../../hooks/Others/query";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";

// Helper function to remove HTML tags from a string
const stripHtmlTags = (str: string) => {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
};

const AboutUsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const getAllContent: any = useGetallContent();
  const aboutPageData = getAllContent?.data?.aboutPage?.[0];

  // Data for the features list
  const features = aboutPageData
    ? [
        { number: "01", text: aboutPageData.twocolEqMod1Heading },
        { number: "02", text: aboutPageData.twocolEqMod2Heading },
        { number: "03", text: aboutPageData.twocolEqMod3Heading },
        { number: "04", text: aboutPageData.twocolEqMod4Heading },
      ]
    : [];

  return (
    <View style={[styles.parentContainer, { paddingTop: insets.top }]}>
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      {getAllContent.isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : !aboutPageData ? (
        <View style={styles.centered}>
          <Text>Content not available.</Text>
        </View>
      ) : (
        <ScrollView>
          {/* Section 1: Who we Are */}
          <View style={styles.whoWeAreSection}>
            <Text style={styles.sectionTitle}>
              {aboutPageData.leftContentSectionHeading}
            </Text>
            <View style={styles.underline} />
            <Text style={styles.descriptionText}>
              {stripHtmlTags(aboutPageData.leftContentSectionEditorField)}
            </Text>
          </View>

          {/* Section 2: Image with baked-in metrics */}
          {/* We now use a simple Image component, assuming ImageModule.aboutUs contains the full image with text */}
          {/* <Image
            source={ImageModule.aboutUs}
            style={styles.metricsImage}
            resizeMode="cover" // Fills the area, might crop slightly if aspect ratios don't match perfectly
          /> */}

          {/* Section 3: Numbered Features List (as per the first request) */}
          <View style={styles.featuresSection}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureNumber}>{feature.number}</Text>
                <Text style={styles.featureText}>{feature.text.trim()}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white, // Ensures the entire screen background, including status bar area, is white
  },
  // The scrollContainer and contentWrapper styles have been removed for a simpler, seamless layout
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Who we Are Section
  whoWeAreSection: {
    padding: 24,
    backgroundColor: theme.colors.white,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold", // Use 'bold' which is equivalent to '700'
    color: theme.colors.black,
  },
  underline: {
    height: 4,
    width: 60, // Adjusted width to better match the screenshot
    backgroundColor: theme.colors.primary, // This should be your app's green color
    marginTop: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 24,
  },
  // Metrics Image Section
  metricsImage: {
    width: "100%",
    height: undefined, // Let aspectRatio define the height relative to the width
    aspectRatio: 2 / 3, // An aspect ratio that fits the tall image from the screenshot
  },
  // The overlay and related styles are no longer needed
  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: theme.colors.white,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  featureNumber: {
    fontSize: 52,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 16,
    width: 80,
    textAlign: "center",
  },
  featureText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    textTransform: "uppercase",
  },
});

export default AboutUsScreen;
