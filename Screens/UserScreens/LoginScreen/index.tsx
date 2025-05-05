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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { Formik } from "formik";
import * as Yup from "yup";
import theme from "../../../utils/theme";

const { height, width } = Dimensions.get("window");

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
});

const LoginScreen = ({ navigation }: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginSubmit = (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      if (values.username === "test" && values.password === "password123") {
        console.log("Login Successful");
      } else {
        console.log("Login Failed");
        setErrors({ submit: "Invalid username or password" });
      }
      setSubmitting(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleRegister = () => {
    navigation.replace("RegisterScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Formik
          initialValues={{ username: "", password: "" }}
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
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Welcome back!</Text>
                <Text style={styles.headerSubtitle}>Sign in to continue!</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="user name"
                  placeholderTextColor={theme.colors.grey}
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <View style={styles.inputUnderline} />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
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
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Log in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                disabled={isSubmitting}
              >
                <Text style={styles.forgotPasswordText}>Forgot password</Text>
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
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.1,
    justifyContent: "flex-start",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: height * 0.06,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
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
    padding: 5,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.red,
    marginTop: 4,
    marginBottom: 8,
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
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey,
  },
  forgotPasswordButton: {
    marginTop: height * 0.03,
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: theme.colors.primary,
    ...theme.font.fontRegular,
  },
  footer: {
    position: "absolute",
    bottom: height * 0.05,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: theme.colors.grey,
    ...theme.font.fontRegular,
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
    ...theme.font.fontMedium,
  },
});

export default LoginScreen;
