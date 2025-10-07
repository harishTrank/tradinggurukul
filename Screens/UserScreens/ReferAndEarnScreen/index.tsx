import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Clipboard from "@react-native-clipboard/clipboard";
import Feather from "react-native-vector-icons/Feather";

import theme from "../../../utils/theme";
import HomeHeader from "../../Components/HomeHeader";
import ImageModule from "../../../ImageModule";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import {
  getRefralCodeApi,
  withdrawRequestApi,
} from "../../../store/Services/Others";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { TextInput } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

// --- Mock Data (Replace with your API data) --

const ReferAndEarnScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [referralData, setReferralData]: any = useState({
    referralCode: "FRIEND25",
    referralLink:
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=com.anonymous.tradinggurukul"
        : "https://play.google.com/store/apps/details?id=com.anonymous.tradinggurukul",
    rewardTitle: "Give ₹100, Get ₹100!",
    rewardDescription:
      "Share your unique referral link with friends. When they sign up and make their first purchase.",
  });
  const [userDetails]: any = useAtom(userDetailsGlobal);

  const getRefrenceHandler = useCallback((user_id: any) => {
    setLoading(true);
    getRefralCodeApi({
      body: {
        user_id,
      },
    })
      ?.then((res: any) => {
        setLoading(false);
        setReferralData((oldval: any) => {
          return {
            ...oldval,
            referralCode: res?.data?.refer_earn_code,
            amount_referrer: res?.data?.amount_referrer,
            amount_earner: res?.data?.amount_earner,
            total_earnings: res?.data?.total_earnings,
            rewardTitle: `Give ₹${res?.data?.amount_referrer}, Get ₹${res?.data?.amount_referrer}!`,
          };
        });
      })
      ?.catch((err: any) => setLoading(false));
  }, []);

  useEffect(() => {
    if (userDetails?.id) {
      getRefrenceHandler(userDetails?.id);
    }
  }, [userDetails?.id]);

  useFocusEffect(
    React.useCallback(() => {
      if (userDetails?.id) {
        getRefrenceHandler(userDetails?.id);
      }
    }, [userDetails?.id, getRefrenceHandler])
  );

  const onCopyToClipboard = () => {
    Clipboard.setString(referralData.referralCode);
    setCopied(true);
    Alert.alert(
      "Copied!",
      "Your referral code has been copied to the clipboard."
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! I'm using this awesome app and I think you'll love it. Sign up using my referral code to get a special discount! 🎁\n\nLink: ${referralData.referralLink}\nOr use my code: ${referralData.referralCode}`,
        title: "Join me on this Awesome App!",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared via:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const onSubmitWithdraw = async () => {
    if (upiId.trim() === "") {
      Alert.alert("Error", "Please enter your UPI ID.");
      return;
    }

    setLoading(true);
    withdrawRequestApi({
      body: {
        user_id: userDetails?.id,
        upi_id: upiId,
      },
    })
      ?.then(() => {
        setLoading(false);
        setIsModalVisible(false);
        setUpiId("");
        Alert.alert(
          "Success",
          "Your withdrawal request has been submitted! If your request is accepted, you will receive your funds within 5–7 working days."
        );
      })
      ?.catch((err: any) => {
        setLoading(false);
        setIsModalVisible(false);
        Alert.alert("Error", err?.data?.message);
      });
  };

  return (
    <View style={[styles.parentContainer, { paddingTop: insets.top }]}>
      {loading && <FullScreenLoader />}
      <View style={styles.headerWrapper}>
        <HomeHeader
          onMenuPress={navigation.toggleDrawer}
          onCartPress={() => navigation.navigate("CartScreen")}
          navigation={navigation}
        />
      </View>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <Image
            source={ImageModule.referFriend}
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.walletContainer}>
            <Feather name="gift" size={28} color={theme.colors.primary} />
            <View style={styles.walletTextContainer}>
              <Text style={styles.walletLabel}>Your Wallet Balance</Text>
              <Text style={styles.walletAmount}>
                ₹{referralData?.total_earnings || 0}
              </Text>
            </View>
            {referralData?.total_earnings > 0 && (
              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>{referralData.rewardTitle}</Text>
          <Text style={styles.description}>
            {referralData.rewardDescription}
          </Text>

          <Text style={styles.yourCodeLabel}>Your Unique Referral Code</Text>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCodeText}>
              {referralData.referralCode}
            </Text>
            <TouchableOpacity
              onPress={onCopyToClipboard}
              style={styles.copyButton}
            >
              <Feather
                name={copied ? "check-circle" : "copy"}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={onShare}>
            <Feather
              name="share-2"
              size={20}
              color={theme.colors.white}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.ctaButtonText}>Share Your Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(!isModalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Withdraw Request</Text>
            <Text style={styles.modalText}>
              Enter your UPI ID to receive payment
            </Text>
            <TextInput
              placeholder="example@upi"
              value={upiId}
              onChangeText={setUpiId}
              style={styles.input}
              placeholderTextColor="#777"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={onSubmitWithdraw}
            >
              <Text style={styles.submitText}>Submit Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  headerWrapper: {
    backgroundColor: theme.colors.primary,
  },
  scrollContainer: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    backgroundColor: theme.colors.white,
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  mainContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  illustration: {
    width: "90%",
    height: 220,
    marginBottom: 20,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(240, 120, 40, 0.1)", // Using a light shade of your primary color
    borderRadius: 15,
    padding: 15,
    width: "100%",
    marginBottom: 25,
  },
  walletTextContainer: {
    marginLeft: 15,
  },
  walletLabel: {
    fontSize: 14,
    color: theme.colors.greyText,
    fontFamily: "Arial",
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    fontFamily: "Arial-BoldMT",
  },
  title: {
    fontSize: 28,
    fontFamily: "Arial-BoldMT",
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    ...theme.font.fontMedium,
    fontSize: 16,
    fontFamily: "Arial",
    color: theme.colors.black,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  yourCodeLabel: {
    ...theme.font.fontMedium,
    fontSize: 14,
    fontFamily: "Arial",
    color: theme.colors.black,
    marginBottom: 8,
  },
  referralCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 30,
  },
  referralCodeText: {
    fontSize: 22,
    fontFamily: "CourierNew-Bold",
    fontWeight: "bold",
    color: theme.colors.black,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 5,
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ctaButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontFamily: "Arial-BoldMT",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: theme.colors.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  withdrawButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: "auto",
  },
  withdrawText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ReferAndEarnScreen;
