import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import HomeHeader from "../../Components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supportDetailsApi } from "../../../store/Services/Others";

const SupportScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [contactDetail, setContactDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supportDetailsManager = () => {
      setIsLoading(true);
      supportDetailsApi()
        ?.then((res: any) => {
          setContactDetail(res);
        })
        ?.catch((err: any) => {
          console.log("Error fetching support details:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    supportDetailsManager();
  }, []);

  const handleLinkPress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }

    if (!contactDetail) {
      return (
        <View style={styles.loaderContainer}>
          <Text>
            Could not load support information. Please try again later.
          </Text>
        </View>
      );
    }

    const { contact_info, social_media } = contactDetail;
    const phone = contact_info?.phone;
    const whatsappUrl = social_media?.whatsapp?.url;

    const socialLinks = Object.entries(social_media || {})
      .filter(([key, value]: [string, any]) => key !== "whatsapp" && value.url)
      .map(([key, value]: [string, any]) => ({
        platform: key,
        ...value,
      }));

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Facing any issues?</Text>
        <Text style={styles.subtitle}>
          Connect with our team and they will help you out with anything that
          you need.
        </Text>

        {/* --- Contact Buttons --- */}
        <View style={styles.buttonsContainer}>
          {phone && (
            <View style={[styles.buttonBox, styles.callBorder]}>
              <TouchableOpacity
                style={styles.touchableContent}
                onPress={() => handleLinkPress(`tel:+91${phone}`)}
              >
                <Ionicons name="call" size={24} color="red" />
                <Text style={styles.buttonText}>Call us</Text>
              </TouchableOpacity>
            </View>
          )}

          {phone && (
            <View style={[styles.buttonBox, styles.chatBorder]}>
              <TouchableOpacity
                style={styles.touchableContent}
                onPress={() => handleLinkPress(`sms:+91${phone}`)}
              >
                <AntDesign name="message1" size={24} color={"#268df6"} />
                <Text style={styles.buttonText}>Chat with us</Text>
              </TouchableOpacity>
            </View>
          )}

          {whatsappUrl && (
            <View style={[styles.buttonBox, styles.whatsappBorder]}>
              <TouchableOpacity
                style={styles.touchableContent}
                onPress={() => handleLinkPress(whatsappUrl)}
              >
                <Ionicons name="logo-whatsapp" size={24} color={"#56c515"} />
                <Text style={styles.buttonText}>Whatsapp</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* --- Social Media Section --- */}
        {socialLinks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Follow us on Social Media</Text>
            <View style={styles.socialContainer}>
              {socialLinks.map(({ platform, url, icon }) => (
                <TouchableOpacity
                  key={platform}
                  style={styles.socialButton}
                  onPress={() => handleLinkPress(url)}
                >
                  <Image source={{ uri: icon }} style={styles.socialIcon} />
                  <Text style={styles.socialText} numberOfLines={1}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.footerText}>
          Available all 365 days between 9AM to 9PM
        </Text>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    color: "black",
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 14,
    color: "black",
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonBox: {
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 10,
  },
  callBorder: { borderColor: "red" },
  chatBorder: { borderColor: "#268df6" },
  whatsappBorder: { borderColor: "#56c515" },
  touchableContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "black",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    marginTop: 20,
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  socialButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%", // slightly bigger so text fits
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  socialText: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    flexShrink: 1, // prevents text cutoff
  },
  footerText: {
    fontWeight: "600",
    fontSize: 14,
    color: "black",
    marginTop: 20,
  },
});

export default SupportScreen;
