// screens/CartScreen.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeHeader from "../../Components/HomeHeader";
import CartItem from "./Components/CartItem";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartItemListCall } from "../../../hooks/Others/mutation";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useAtom } from "jotai";
import { userDetailsGlobal } from "../../../JotaiStore";
import { phonePeApi, removeCartItemCall } from "../../../store/Services/Others";
import Toast from "react-native-toast-message";
import axios from "axios";

const CartScreen = ({ navigation }: any) => {
  const [cartApiResponse, setcartApiResponse]: any = useState([]);
  const cartItemListApi: any = useCartItemListCall();
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [cartBottomPrices, setCartBottomPrices]: any = useState({});
  const [loading, setLoading]: any = useState(false);

  const cartListApiManager = () => {
    cartItemListApi
      ?.mutateAsync({
        body: {
          user_id: userDetails?.id,
        },
      })
      ?.then((res: any) => {
        setcartApiResponse(res?.cart_data);
        delete res?.cart_data;
        setCartBottomPrices(res);
      })
      ?.catch((err: any) => console.log("err", err));
  };

  useEffect(() => {
    if (userDetails?.id) {
      cartListApiManager();
    }
  }, [userDetails?.id]);

  const removeCartManager = (cart_item_key: any) => {
    setLoading(true);
    removeCartItemCall({
      query: {
        cart_item_key,
      },
    })
      ?.then(() => {
        cartListApiManager();
        Toast.show({
          type: "success",
          text1: "Remove course successfully.",
        });
        setLoading(false);
      })
      ?.catch((err: any) => setLoading(false));
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeCartManager(itemId),
        },
      ]
    );
  };

  const handleCoursePressed = (courseId: any) => {
    navigation.navigate("ViewCourseScreen", { courseId });
  };

  const handleProceedToCheckout = async () => {
    try {
      const result: any = await phonePeApi({
        body: {
          "user_id": userDetails?.id,
          "amount": cartBottomPrices?.total,
          "merchantId": "M23NDSN3ZSIP5"
        }
      })
      const url = result?.data?.instrumentResponse?.redirectInfo?.url;
      console.log('url', result)
      if (url) {
        Linking.openURL(url);
      } else {
        console.log("Payment URL not found");
      }
    } catch(error) {
      console.log('error', error)
    }
  };

  const renderCartItem: any = ({ item }: any) => (
    <CartItem
      item={item}
      onRemove={handleRemoveItem}
      onPress={handleCoursePressed}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: useSafeAreaInsets().top },
      ]}
    >
      <StatusBar style="dark" />
      {(loading || cartItemListApi?.isLoading) && <FullScreenLoader />}
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
        menu={false}
        cart={false}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Cart</Text>

        <FlatList
          data={cartApiResponse || []}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          }
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {cartApiResponse.length > 0 && (
          <View style={styles.footerContainer}>
            <View style={styles.orderInfoCard}>
              <Text style={styles.orderInfoTitle}>Order Info</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SubTotal</Text>
                <Text style={styles.infoValue}>
                  ₹ {cartBottomPrices?.cart_subtotal}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Discount</Text>
                <Text style={styles.infoValue}>
                  ₹ {cartBottomPrices?.discount_total}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Taxes</Text>
                <Text style={styles.infoValue}>
                  ₹ {cartBottomPrices?.taxes}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.totalLabel]}>Total</Text>
                <Text style={[styles.infoValue, styles.totalValue]}>
                  ₹ {cartBottomPrices?.total}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  list: {
    flex: 1,
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: theme.colors.grey,
    ...theme.font.fontMedium,
  },
  footerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  orderInfoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  orderInfoTitle: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.greyText,
    ...theme.font.fontRegular,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.lightGrey,
    marginVertical: 10,
  },
  totalLabel: {
    color: theme.colors.black,
    ...theme.font.fontMedium,
  },
  totalValue: {
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    ...theme.font.fontMedium,
  },
});

export default CartScreen;
