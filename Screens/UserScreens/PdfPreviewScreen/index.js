import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
  Platform, // Import Platform for OS-specific styling
} from "react-native";
import Pdf from "react-native-pdf";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PdfPreviewScreen = ({ route, navigation }) => {
  const { pdfUrl, title } = route.params;
  const insets = useSafeAreaInsets(); // Hook to get safe area dimensions

  const source = { uri: pdfUrl, cache: true };

  const handleDownload = async () => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert("Error", "Cannot open this URL.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while trying to open the file.");
    }
  };

  return (
    <View style={styles.container}>
      {/* PDF viewer is now in the background, filling the whole screen */}
      <Pdf
        source={source}
        style={styles.pdf}
        trustAllCerts={false}
        renderActivityIndicator={() => (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
        onError={(error) => {
          console.log(error);
          Alert.alert("Error", "Could not load the document.");
        }}
      />

      {/* Custom Header that overlays the PDF */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={26} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || "Study Material"}
        </Text>
      </View>

      {/* Download button that overlays the PDF */}
      <TouchableOpacity
        style={[
          styles.downloadButton,
        ]}
        onPress={handleDownload}
      >
        <Icon name="file-download" size={24} color={theme.colors.white} />
        <Text style={styles.downloadButtonText}>Download Study Material</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  pdf: {
    // This makes the PDF fill the entire screen, behind other elements
    ...StyleSheet.absoluteFillObject,
  },
  // New styles for the custom header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary, // Semi-transparent background
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10, // Padding at the bottom of the header content
    zIndex: 10, // Ensures header is on top
  },
  backButton: {
    padding: 10, // Increases touchable area
    borderRadius: 20,
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    flex: 1, // Allows the title to take remaining space and be truncated
  },
  // Updated styles for the download button
  downloadButton: {
    position: "absolute",
    bottom: 20, // Give some space from the bottom edge
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  downloadButtonText: {
    color: theme.colors.white,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PdfPreviewScreen;
