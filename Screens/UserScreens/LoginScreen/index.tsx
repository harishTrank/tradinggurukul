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
import { useloginApiCall } from "../../../hooks/Auth/mutation";
import FullScreenLoader from "../../Components/FullScreenLoader";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";

const { height, width } = Dimensions.get("window");

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
});

const LoginScreen = ({ navigation }: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginApiCaller: any = useloginApiCall();
  const [, setUserDetails]: any = useAtom(userDetailsGlobal);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginSubmit = (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    loginApiCaller
      ?.mutateAsync({
        body: values,
      })
      ?.then(async (res: any) => {
        if (res?.code === "0") {
          return Toast.show({
            type: "error",
            text1: res.message,
          });
        } else {
          await AsyncStorage.setItem(
            "userDetail",
            JSON.stringify(res?.details)
          );
          setUserDetails(res?.details);
          await AsyncStorage.setItem("loginFlag", "true");
          navigation.reset({
            index: 0,
            routes: [{ name: "DrawerNavigation" }],
          });
        }
      })
      ?.catch((err: any) => {
        setSubmitting(false);
        Toast.show({
          type: "error",
          text1: err.message,
        });
      });
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loginApiCaller?.isLoading && <FullScreenLoader />}
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLoginSubmit}
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
              <View style={styles.formInnerContainer}>
                <View style={styles.headerContainer}>
                  <Text style={styles.headerTitle}>Welcome back!</Text>
                  <Text style={styles.headerSubtitle}>
                    Sign in to continue!
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="email address"
                    placeholderTextColor={theme.colors.grey}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                  <View style={styles.inputUnderline} />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="password"
                      placeholderTextColor={theme.colors.grey}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!isPasswordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      <Feather
                        name={isPasswordVisible ? "eye" : "eye-off"}
                        size={24}
                        color={theme.colors.grey}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputUnderline} />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  {errors.submit && (
                    <Text style={[styles.errorText, styles.submitError]}>
                      {errors.submit}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                  ]}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={handleForgotPassword}
                  disabled={isSubmitting}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => navigation.replace("DrawerNavigation")}
                  disabled={isSubmitting}
                >
                  <Text style={styles.skipButtonText}>{"Skip >"}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.registerText}>
                      New User?{" "}
                      <Text style={styles.registerLink}>Register here</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingVertical: height * 0.05,
  },
  formInnerContainer: {},
  headerContainer: {
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  headerTitle: {
    fontSize: 28,
    color: theme.colors.black,
    marginBottom: 8,
    ...theme.font.fontSemiBold,
  },
  headerSubtitle: {
    fontSize: 20,
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.01,
  },
  input: {
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: 12,
    ...theme.font.fontMedium,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  passwordInput: {
    flex: 1,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: theme.colors.grey,
    marginTop: -5,
  },
  eyeIcon: {
    paddingLeft: 10,
    paddingVertical: 5,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.red,
    marginTop: 4,
    minHeight: 20,
    ...theme.font.fontRegular,
  },
  submitError: {
    textAlign: "center",
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.03,
  },
  loginButtonText: {
    fontSize: 18,
    color: theme.colors.white,
    ...theme.font.fontMedium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey,
  },
  forgotPasswordButton: {
    marginTop: height * 0.025,
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: theme.colors.primary,
    ...theme.font.fontRegular,
  },
  skipButton: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
  },
  footer: {
    marginTop: height * 0.05,
    paddingBottom: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
  },
  registerLink: {
    color: theme.colors.primary,
    ...theme.font.fontMedium,
  },
});

export default LoginScreen;
