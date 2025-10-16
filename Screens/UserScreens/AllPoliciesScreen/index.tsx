import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useGetallContent } from "../../../hooks/Others/query";
import HomeHeader from "../../Components/HomeHeader";
import theme from "../../../utils/theme";

import AboutUsScreen from "../AboutUsScreen";
import PrivacyPolicyScreen from "../PrivacyPolicyScreen";
import RefundScreen from "../RefundScreen";
import TermsAndConditionScreen from "../TermsAndConditionScreen";
import { useFocusEffect } from "@react-navigation/native";

// Enable smooth animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AllPoliciesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const getAllContent: any = useGetallContent();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  useFocusEffect(
    useCallback(() => {
      setOpenSection(null);
    }, [])
  );

  return (
    <View style={[styles.parentContainer, { paddingTop: insets.top }]}>
      <HomeHeader
        onMenuPress={() => navigation?.toggleDrawer?.()}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      {getAllContent.isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* About Us */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => handleToggle("about")}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>About Us</Text>
              <Icon
                name={openSection === "about" ? "chevron-up" : "chevron-down"}
                size={22}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            {openSection === "about" && (
              <View style={styles.cardBody}>
                <AboutUsScreen navigation={navigation} />
              </View>
            )}
          </View>

          {/* Privacy Policy */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => handleToggle("privacy")}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Privacy Policy</Text>
              <Icon
                name={openSection === "privacy" ? "chevron-up" : "chevron-down"}
                size={22}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            {openSection === "privacy" && (
              <View style={styles.cardBody}>
                <PrivacyPolicyScreen navigation={navigation} />
              </View>
            )}
          </View>

          {/* Refund Policy */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => handleToggle("refund")}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Refund Policy</Text>
              <Icon
                name={openSection === "refund" ? "chevron-up" : "chevron-down"}
                size={22}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            {openSection === "refund" && (
              <View style={styles.cardBody}>
                <RefundScreen navigation={navigation} />
              </View>
            )}
          </View>

          {/* Terms & Conditions */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => handleToggle("terms")}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Terms & Conditions</Text>
              <Icon
                name={openSection === "terms" ? "chevron-up" : "chevron-down"}
                size={22}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            {openSection === "terms" && (
              <View style={styles.cardBody}>
                <TermsAndConditionScreen navigation={navigation} />
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.black,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default AllPoliciesScreen;
