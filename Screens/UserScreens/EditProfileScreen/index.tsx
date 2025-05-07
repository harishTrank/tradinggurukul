// Screens/UserScreens/EditProfileScreen.tsx
import React, { useState } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Formik } from "formik";
import * as Yup from "yup";

import Icon from "react-native-vector-icons/Feather";
import theme from "../../../utils/theme"; // Adjusted path

const initialUserData = {
  firstName: "Sophia",
  lastName: "Bennett",
  email: "Sophia@Example.com", // This will be part of initialValues but not actively validated if not editable
  displayName: "Sophia Grace Bennett",
  profileImageUrl: require("../../../assets/Images/dummy1.png"),
};

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
  email: string; // Include for initial values, even if not editable
  displayName: string;
}

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const [profileImage, setProfileImage] = useState(
    initialUserData.profileImageUrl
  );

  const handleFormSubmit = (values: FormValues) => {
    console.log("Updated Profile Data:", {
      ...values,
      profileImage, // Include the current profile image URI/require
    });
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated."
    );
  };

  const handleChangeProfileImage = () => {
    Alert.alert(
      "Change Image",
      "Image picker functionality to be implemented."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

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
        }) => (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={handleChangeProfileImage}>
                  <Image source={profileImage} style={styles.profileImage} />
                  <View style={styles.editIconOverlay}>
                    <Icon name="camera" size={18} color={theme.colors.white} />
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
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    placeholder="Enter your last name"
                    placeholderTextColor={theme.colors.greyText || "#888"}
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={values.email} // Display from Formik's initial values
                    placeholder="Enter your email address"
                    placeholderTextColor={theme.colors.greyText || "#888"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Display Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("displayName")}
                    onBlur={handleBlur("displayName")}
                    value={values.displayName}
                    placeholder="Enter your display name"
                    placeholderTextColor={theme.colors.greyText || "#888"}
                  />
                  {touched.displayName && errors.displayName && (
                    <Text style={styles.errorText}>{errors.displayName}</Text>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </>
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
    marginBottom: 20, // Reduced margin slightly for error text
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
    backgroundColor: theme.colors.border,
    color: theme.colors.greyText || "#888",
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.red,
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
