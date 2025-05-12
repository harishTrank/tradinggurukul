import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "../../../utils/theme";
import { useSendOTPCall, useVerifyOTPCall } from "../../../hooks/Auth/mutation";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");
const OTP_LENGTH = 6;

const OTPScreen = ({ navigation, route }: any) => {
  const emailFromPreviousScreen = route?.params?.email || "your email";

  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const otpVerifyApiCaller: any = useVerifyOTPCall();
  const resendPasswordApiCall: any = useSendOTPCall();

  const handleResendCode = () => {
    setResendDisabled(true);
    resendPasswordApiCall
      ?.mutateAsync({
        body: {
          email: emailFromPreviousScreen,
        },
      })
      ?.then((res: any) => {
        setResendDisabled(false);
        if (res?.code == "0") {
          return Toast.show({
            type: "error",
            text1: res.message,
          });
        } else {
          return Toast.show({
            type: "success",
            text1: res.message,
          });
        }
      })
      ?.catch((err: any) => {
        setResendDisabled(false);
      });
  };

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  const handleOtpChange = (text: string) => {
    const newOtp = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtpCode(newOtp);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleContinue = () => {
    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert("Incomplete OTP", `Please enter all ${OTP_LENGTH} digits.`);
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    otpVerifyApiCaller
      ?.mutateAsync({
        body: {
          email: emailFromPreviousScreen,
          otp: otpCode,
        },
      })
      ?.then((res: any) => {
        setIsSubmitting(false);
        if (res?.code == "0") {
          return Toast.show({
            type: "error",
            text1: res.message,
          });
        } else {
          navigation.navigate("ResetPasswordScreen", {
            email: emailFromPreviousScreen,
          });
          return Toast.show({
            type: "success",
            text1: res.message,
          });
        }
      })
      ?.catch((err: any) => {
        setIsSubmitting(false);
      });
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < OTP_LENGTH; i++) {
      const digit = otpCode[i] || "";
      const isCurrent = i === otpCode.length;
      const isLastFilled =
        i === OTP_LENGTH - 1 && otpCode.length === OTP_LENGTH;
      const isFocusedStyle = isInputFocused && (isCurrent || isLastFilled);

      boxes.push(
        <View
          key={i}
          style={[
            styles.otpInputBox,
            isFocusedStyle && styles.otpInputBoxHighlighted,
          ]}
        >
          <Text style={styles.otpDigit}>{digit}</Text>
        </View>
      );
    }
    return boxes;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={false}
        >
          <TextInput
            ref={inputRef}
            value={otpCode}
            onChangeText={handleOtpChange}
            maxLength={OTP_LENGTH}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            style={styles.hiddenInput}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            caretHidden
            autoFocus={true}
          />

          <View style={styles.contentContainer}>
            <Text style={styles.screenTitle}>Enter the OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a password recover OTP{"\n"}to{" "}
              {emailFromPreviousScreen}
            </Text>

            <Pressable onPress={focusInput} style={styles.otpBoxContainer}>
              {renderOtpBoxes()}
            </Pressable>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't get the OTP? </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendDisabled}
              >
                <Text
                  style={[
                    styles.resendLink,
                    resendDisabled && styles.resendLinkDisabled,
                  ]}
                >
                  {resendDisabled
                    ? `Resend Code in ${countdown}s`
                    : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                (isSubmitting || otpCode.length !== OTP_LENGTH) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={isSubmitting || otpCode.length !== OTP_LENGTH}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Didn't get any email? Check your spam{"\n"}folder or try again
              with a valid email.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: height * 0.1,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.1,
  },
  screenTitle: {
    fontSize: 26,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
    textAlign: "center",
    marginBottom: height * 0.05,
    lineHeight: 22,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
    minHeight: 50,
  },
  otpInputBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.grey,
    justifyContent: "center",
    alignItems: "center",
  },
  otpDigit: {
    fontSize: 20,
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  otpInputBoxHighlighted: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: height * 0.06,
  },
  resendText: {
    fontSize: 14,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
  },
  resendLink: {
    fontSize: 14,
    color: theme.colors.primary,
    ...theme.font.fontMedium,
  },
  resendLinkDisabled: {
    color: theme.colors.grey,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 18,
    color: theme.colors.white,
    ...theme.font.fontMedium,
    textTransform: "none",
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightGrey,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.grey,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginTop: height * 0.1,
  },
});

export default OTPScreen;
