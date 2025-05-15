// Screens/UserScreens/EditProfileScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

import Icon from "react-native-vector-icons/Feather";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { useEditProfileCall } from "../../../hooks/Others/mutation";
import Toast from "react-native-toast-message";
import { getImage, takePicture } from "../../../utils/extra/ImagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { getfileobj } from "../../../utils/extra/UserUtils";

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Last name is required"),
  displayName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Display name is required"),
});

type EditProfileScreenNavigationProp = StackNavigationProp<any>;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
}

const IOS_HEADER_HEIGHT_ESTIMATE = 10 * 2 + 24 + 1;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [userDetailsGl, setUserDetails]: any = useAtom(userDetailsGlobal);
  const updateProfileAPiCall: any = useEditProfileCall();
  const initialUserData = {
    firstName: userDetailsGl?.first_name || "",
    lastName: userDetailsGl?.last_name || "",
    email: userDetailsGl?.email || "",
    displayName: userDetailsGl?.display_name || userDetailsGl?.username || "",
    profileImageUrl:
      userDetailsGl?.avatar_url ||
      "https://imgs.search.brave.com/6mHxYf-0_iKSMzgOo-MtP40kdw8ehAhV39Ci6xD2-Ac/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvcHJvZmlsZS1p/Y29uLXZlY3Rvci1p/bWFnZS1jYW4tYmUt/dXNlZC11aV8xMjA4/MTYtMjYwOTMyLmpw/Zz9zZW10PWFpc19o/eWJyaWQmdz03NDA",
  };
  const [profileImage, setProfileImage] = useState(
    initialUserData.profileImageUrl
  );

  const lastNameInputRef = useRef<TextInput>(null);
  const displayNameInputRef = useRef<TextInput>(null);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const buttonAnimatedValue = useRef(new Animated.Value(1)).current;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardWillShowListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
      Animated.timing(buttonAnimatedValue, {
        toValue: 0,
        duration: Platform.OS === "ios" ? 250 : 200,
        useNativeDriver: true,
      }).start();
    });

    const keyboardWillHideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      Animated.timing(buttonAnimatedValue, {
        toValue: 1,
        duration: Platform.OS === "ios" ? 250 : 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [buttonAnimatedValue]);
  const getButtonContainerHeight = () => {
    const containerPadding =
      (styles.buttonContainer?.paddingVertical ?? 20) * 2;
    const buttonPadding = (styles.updateButton?.paddingVertical ?? 15) * 2;
    const buttonTextSize = styles.updateButtonText?.fontSize ?? 16;
    const containerBorder = styles.buttonContainer?.borderTopWidth ?? 1;
    return (
      containerPadding + buttonPadding + buttonTextSize + containerBorder + 10
    );
  };

  const buttonAnimatedStyle = {
    opacity: buttonAnimatedValue,
    transform: [
      {
        translateY: buttonAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [getButtonContainerHeight(), 0],
        }),
      },
    ],
  };

  const handleFormSubmit = (values: FormValues) => {
    Keyboard.dismiss();
    const body: any = new FormData();
    body.append("user_id", userDetailsGl?.id);
    body.append("image", getfileobj(profileImage));
    body.append("first_name", values?.firstName);
    body.append("last_name", values?.lastName);
    body.append("display_name", values?.displayName);
    updateProfileAPiCall
      ?.mutateAsync({
        body,
      })
      ?.then(async (res: any) => {
        if (res?.status == "0") {
          return Toast.show({
            type: "error",
            text1: res?.msg,
          });
        } else {
          await AsyncStorage.setItem(
            "userDetail",
            JSON.stringify(res?.details)
          );
          setUserDetails(res?.details);
          navigation?.goBack();
          return Toast.show({
            type: "success",
            text1: "User Update successfully.",
          });
        }
      })
      ?.catch((err: any) => {
        console.log("err", err);
      });
  };

  const handleChangeProfileImage = () => {
    Alert.alert("Pick Post", "Choose from camera or gallery", [
      {
        text: "Gallery",
        onPress: () => getImage(setProfileImage),
        style: "default",
      },
      {
        text: "Camera",
        onPress: async () => await takePicture(setProfileImage),
        style: "default",
      },
      {
        text: "Cancel",
        style: "default",
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <StatusBar style="dark" />
      {updateProfileAPiCall?.isLoading && <FullScreenLoader />}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerButton} />
      </View>

      <Formik
        innerRef={formikRef}
        initialValues={{
          firstName: initialUserData.firstName,
          lastName: initialUserData.lastName,
          email: initialUserData.email,
          displayName: initialUserData.displayName,
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }: any) => (
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? IOS_HEADER_HEIGHT_ESTIMATE : 0
            }
          >
            <>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.profileImageContainer}>
                  <TouchableOpacity onPress={handleChangeProfileImage}>
                    {profileImage && profileImage !== "" && (
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                      />
                    )}
                    <View style={styles.editIconOverlay}>
                      <Icon
                        name="camera"
                        size={18}
                        color={theme.colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.profileName}>
                    {values.displayName ||
                      `${values.firstName} ${values.lastName}`}
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      value={values.firstName}
                      placeholder="Enter your first name"
                      placeholderTextColor={theme.colors.greyText || "#888"}
                      returnKeyType="next"
                      onSubmitEditing={() => lastNameInputRef.current?.focus()}
                    />
                    {touched.firstName && errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      ref={lastNameInputRef}
                      style={styles.input}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      value={values.lastName}
                      placeholder="Enter your last name"
                      placeholderTextColor={theme.colors.greyText || "#888"}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        displayNameInputRef.current?.focus()
                      }
                    />
                    {touched.lastName && errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={[styles.input, styles.disabledInput]}
                      value={values.email}
                      placeholder="Enter your email address"
                      placeholderTextColor={theme.colors.greyText || "#888"}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>User Name</Text>
                    <TextInput
                      ref={displayNameInputRef}
                      style={styles.input}
                      onChangeText={handleChange("displayName")}
                      onBlur={handleBlur("displayName")}
                      value={values.displayName}
                      placeholder="Enter your user name"
                      placeholderTextColor={theme.colors.greyText || "#888"}
                      returnKeyType="done"
                      onSubmitEditing={() => handleSubmit()}
                    />
                    {touched.displayName && errors.displayName && (
                      <Text style={styles.errorText}>{errors.displayName}</Text>
                    )}
                  </View>
                </View>
              </ScrollView>

              {!isKeyboardVisible && (
                <Animated.View
                  style={[styles.buttonContainer, buttonAnimatedStyle]}
                >
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </>
          </KeyboardAvoidingView>
        )}
      </Formik>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey || "#ECECEC",
    backgroundColor: theme.colors.white,
  },
  headerButton: {
    padding: 5,
    width: 30,
  },
  headerTitle: {
    fontSize: 20,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    textAlign: "center",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary || "#6FCF97",
  },
  editIconOverlay: {
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: theme.colors.primary || "#6FCF97",
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  profileName: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontMedium,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
    color: theme.colors.black,
    ...theme.font.fontRegular,
  },
  disabledInput: {
    backgroundColor: theme.colors.border || "#E0E0E0",
    color: theme.colors.greyText || "#888",
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.red || "red",
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey || "#ECECEC",
    backgroundColor: theme.colors.white,
  },
  updateButton: {
    backgroundColor: theme.colors.primary || "#6FCF97",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    ...theme.font.fontSemiBold,
  },
});

export default EditProfileScreen;
