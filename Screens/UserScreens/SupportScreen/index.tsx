import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import HomeHeader from "../../Components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SupportScreen = ({ navigation }: any) => {
  const contactNumber = "+918168223751";

  const handleCallPress = () => {
    Linking.openURL(`tel:${contactNumber}`);
  };

  const handleMessagePress = () => {
    Linking.openURL(`sms:${contactNumber}`);
  };

  const handleWhatsAppPress = () => {
    Linking.openURL(`whatsapp://send?phone=${contactNumber}`);
  };

  return (
    <View style={[styles.container, {paddingTop: useSafeAreaInsets().top}]}>
      <HomeHeader
        onMenuPress={navigation.toggleDrawer}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Facing any issues?</Text>
        <Text style={styles.subtitle}>
          {
            "Connect with our team and they will help you out with\nanything that you need."
          }
        </Text>

        {/* This View replaces the Native-Base HStack */}
        <View style={styles.buttonsContainer}>
          {/* Each button is now a View with a TouchableOpacity inside */}
          <View style={[styles.buttonBox, styles.callBorder]}>
            <TouchableOpacity
              style={styles.touchableContent}
              onPress={handleCallPress}
            >
              <Ionicons name="call" size={24} color="red" />
              <Text style={styles.buttonText}>Call us</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonBox, styles.chatBorder]}>
            <TouchableOpacity
              style={styles.touchableContent}
              onPress={handleMessagePress}
            >
              <AntDesign name="message1" size={24} color={"#268df6"} />
              <Text style={styles.buttonText}>Chat with us</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonBox, styles.whatsappBorder]}>
            <TouchableOpacity
              style={styles.touchableContent}
              onPress={handleWhatsAppPress}
            >
              <Ionicons name="logo-whatsapp" size={24} color={"#56c515"} />
              <Text style={styles.buttonText}>Whatsapp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>
          Available all 365 days between 9AM to 9PM
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  callBorder: {
    borderColor: "red",
  },
  chatBorder: {
    borderColor: "#268df6",
  },
  whatsappBorder: {
    borderColor: "#56c515",
  },
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
  footerText: {
    fontWeight: "600",
    fontSize: 14,
    color: "black",
  },
});

export default SupportScreen;
