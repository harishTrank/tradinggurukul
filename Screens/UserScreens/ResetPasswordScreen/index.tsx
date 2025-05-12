import React, { useState } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { Formik } from "formik";
import * as Yup from "yup";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResetPasswordCall } from "../../../hooks/Auth/mutation";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Must contain at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Must match both password")
    .required("Confirm password is required"),
});

const ResetPasswordScreen = ({ navigation, route }: any) => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const resetPasswordApiCall: any = useResetPasswordCall();

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleResetSubmit = (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    resetPasswordApiCall
      ?.mutateAsync({
        body: {
          email: route?.params?.email,
          new_password: values?.newPassword,
        },
      })
      ?.then((res: any) => {
        setSubmitting(false);
        if (res?.code == "0") {
          return Toast.show({
            type: "error",
            text1: res?.message,
          });
        } else {
          navigation.navigate("LoginScreen");
          return Toast.show({
            type: "success",
            text1: res?.message,
          });
        }
      })
      ?.catch((err: any) => {
        setSubmitting(false);
      });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: useSafeAreaInsets().top },
      ]}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={28} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleResetSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }: any) => (
              <>
                <View style={styles.formContainer}>
                  <Text style={styles.screenTitle}>Reset your password</Text>

                  <View style={styles.inputGroup}>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Enter new password"
                        placeholderTextColor={theme.colors.grey}
                        value={values.newPassword}
                        onChangeText={handleChange("newPassword")}
                        onBlur={handleBlur("newPassword")}
                        secureTextEntry={!isNewPasswordVisible}
                        autoCapitalize="none"
                        autoComplete="new-password"
                      />
                    </View>
                    <View style={styles.inputUnderline} />
                    {touched.newPassword && errors.newPassword && (
                      <Text style={styles.errorText}>{errors.newPassword}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="confirm password"
                        placeholderTextColor={theme.colors.grey}
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        secureTextEntry={!isConfirmPasswordVisible}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={toggleConfirmPasswordVisibility}
                        style={styles.eyeIcon}
                      >
                        <Feather
                          name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                          size={24}
                          color={theme.colors.grey}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputUnderline} />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.buttonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color={theme.colors.white} />
                    ) : (
                      <Text style={styles.submitButtonText}>Reset</Text>
                    )}
                  </TouchableOpacity>

                  {errors.submit && (
                    <Text style={[styles.errorText, styles.submitError]}>
                      {errors.submit}
                    </Text>
                  )}
                </View>
              </>
            )}
          </Formik>
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
    paddingHorizontal: width * 0.08,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? height * 0.02 : height * 0.01,
    paddingHorizontal: width * 0.05,
    width: "100%",
    backgroundColor: theme.colors.white,
  },
  backButton: {
    padding: 5,
  },
  formContainer: {
    paddingTop: height * 0.05,
    width: "100%",
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: height * 0.06,
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: height * 0.03,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: 10,
    paddingHorizontal: 2,
    ...theme.font.fontRegular,
  },
  passwordInput: {
    flex: 1,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: theme.colors.grey,
    marginTop: 4,
  },
  eyeIcon: {
    paddingLeft: 10,
    padding: 5,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.red,
    marginTop: 6,
    minHeight: 18,
    ...theme.font.fontRegular,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.04,
  },
  submitButtonText: {
    fontSize: 18,
    color: theme.colors.white,
    ...theme.font.fontMedium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey,
  },
  submitError: {
    textAlign: "center",
    marginTop: 15,
  },
});

export default ResetPasswordScreen;
