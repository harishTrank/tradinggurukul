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
import { useRegisterUser } from "../../../hooks/Auth/mutation";
import Toast from "react-native-toast-message";
import FullScreenLoader from "../../Components/FullScreenLoader";

const { height, width } = Dimensions.get("window");

const phoneRegExp = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must contain at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterScreen = ({ navigation }: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const registerUserApiCall: any = useRegisterUser();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleRegisterSubmit = (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    const { firstName, lastName, phoneNumber, email, password } = values;
    const body: any = new FormData();
    body.append("fname", firstName);
    body.append("lname", lastName);
    body.append("email", email);
    body.append("password", password);
    body.append("mobile", phoneNumber);
    body.append("confirmpass", password);
    body.append("enableOffer", false);

    registerUserApiCall
      ?.mutateAsync({
        body,
      })
      .then((res: any) => {
        setSubmitting(false);
        if (res?.status === "0") {
          return Toast.show({
            type: "error",
            text1: res?.message,
          });
        } else {
          navigation.replace("LoginScreen");
          return Toast.show({
            type: "success",
            text1: "Register user successfully.",
          });
        }
      })
      .catch((err: any) => {
        setSubmitting(false);
        Toast.show({
          type: "error",
          text1: "Email already exit or something went wrong.",
        });
      });
  };

  const handleGoToLogin = () => {
    navigation.replace("LoginScreen");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: useSafeAreaInsets().top },
      ]}
    >
      {registerUserApiCall?.isLoading && <FullScreenLoader />}
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
            initialValues={{
              firstName: "",
              lastName: "",
              phoneNumber: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleRegisterSubmit}
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
                  <Text style={styles.screenTitle}>Enter your details</Text>

                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      placeholderTextColor={theme.colors.grey}
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    <View style={styles.inputUnderline} />
                    {touched.firstName && errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      placeholderTextColor={theme.colors.grey}
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      autoCapitalize="words"
                    />
                    <View style={styles.inputUnderline} />
                    {touched.lastName && errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor={theme.colors.grey}
                      value={values.phoneNumber}
                      onChangeText={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                    />
                    <View style={styles.inputUnderline} />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email Id"
                      placeholderTextColor={theme.colors.grey}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                    />
                    <View style={styles.inputUnderline} />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
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
                        autoComplete="new-password"
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
                      styles.continueButton,
                      isSubmitting && styles.buttonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color={theme.colors.white} />
                    ) : (
                      <Text style={styles.continueButtonText}>Continue</Text>
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

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleGoToLogin} disabled={false}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
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
    paddingHorizontal: width * 0.08,
    paddingBottom: height * 0.05,
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
    paddingTop: height * 0.02,
    width: "100%",
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: height * 0.04,
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: height * 0.02,
  },
  input: {
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: 10,
    paddingHorizontal: 2,
    ...theme.font.fontRegular,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    padding: 5,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.red,
    marginTop: 5,
    minHeight: 18,
    ...theme.font.fontRegular,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.04,
  },
  continueButtonText: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey,
  },
  submitError: {
    textAlign: "center",
    marginTop: 15,
  },
  footerContainer: {
    marginTop: height * 0.04,
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 15,
    color: theme.colors.grey,
    marginBottom: 8,
    ...theme.font.fontRegular,
  },
  signInLink: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "bold",
    ...theme.font.fontMedium,
  },
});

export default RegisterScreen;
