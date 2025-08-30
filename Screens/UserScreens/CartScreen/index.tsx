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
import {
  createOrderApi,
  removeCartItemCall,
  updateStatusOrderApi,
  walletApplyApi,
} from "../../../store/Services/Others";
import Toast from "react-native-toast-message";
import RazorpayCheckout from "react-native-razorpay";

const CartScreen = ({ navigation }: any) => {
  const [cartApiResponse, setcartApiResponse]: any = useState([]);
  const cartItemListApi: any = useCartItemListCall();
  const [userDetails]: any = useAtom(userDetailsGlobal);
  const [cartBottomPrices, setCartBottomPrices]: any = useState({});
  const [loading, setLoading]: any = useState(false);

  const applyWalletManager = (apply: any) => {
    walletApplyApi({
      body: {
        user_id: userDetails?.id,
        apply,
        cart_total: 10,
      },
    })
      ?.then((res: any) => {
        console.log("res", res);
      })
      ?.catch((err: any) => console.log("err", err));
  };

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

  const renderCartItem: any = ({ item }: any) => (
    <CartItem
      item={item}
      onRemove={handleRemoveItem}
      onPress={handleCoursePressed}
    />
  );

  const updateOrderStatusManager = (
    order_id: any,
    transaction_id: any,
    status: any
  ) => {
    console.log("first", {
      order_id,
      user_id: userDetails?.id,
      transaction_id,
      status,
    });
    updateStatusOrderApi({
      body: {
        order_id,
        user_id: userDetails?.id,
        transaction_id,
        status,
      },
    })
      ?.then((res: any) => {
        console.log("res", res);
        cartListApiManager();
      })
      ?.catch((err: any) => {
        console.log("err", err);
      });
  };

  const payWithRazorpay = (userDetails: any, cartBottomPrices: any) => {
    setLoading(true);
    createOrderApi({
      query: {
        u_id: userDetails?.id,
        payment_method: "razorpay",
        amount: cartBottomPrices?.total,
      },
    })
      ?.then((res: any) => {
        var options: any = {
          description: "Order Payment",
          image:
            "https://tradinggurukul.com/trading_backend/wp-content/uploads/2025/08/tradinggurukul-logo-e1754378245418.jpeg",
          currency: "INR",
          key: "rzp_live_MEv3w5udH0dgor",
          amount: cartBottomPrices?.total * 100,
          order_id: res?.data?.razorpay_order?.id,
          name: "Trading Gurukul",
          prefill: {
            email: userDetails?.billing?.email,
            contact: userDetails?.billing?.phone,
            name: userDetails?.username,
          },
          theme: { color: theme.colors.primary },
        };

        RazorpayCheckout.open(options)
          .then((data) => {
            alert(`Success: ${data.razorpay_payment_id}`);
            setLoading(false);
            updateOrderStatusManager(
              res?.data?.order_id,
              data?.razorpay_payment_id,
              "completed"
            );
          })
          .catch((error) => {
            alert(`Error: ${error.code} | ${error.description}`);
            setLoading(false);
            updateOrderStatusManager(
              res?.data?.order_id,
              error?.details?.metadata?.payment_id,
              error?.details?.reason
            );
          });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
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
              onPress={() => payWithRazorpay(userDetails, cartBottomPrices)}
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
