// screens/CartScreen.tsx

import React, { useState, useEffect } from "react";
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
  const [isWalletApplied, setIsWalletApplied] = useState(false); // New state for wallet

  const cartListApiManager = () => {
    return cartItemListApi
      ?.mutateAsync({
        body: {
          user_id: userDetails?.id,
        },
      })
      ?.then((res: any) => {
        setcartApiResponse(res?.cart_data);
        const prices = { ...res };
        delete prices.cart_data;
        setCartBottomPrices(prices);
        // Sync the checkbox state with the backend response
        setIsWalletApplied(parseFloat(prices?.wallet_discount || 0) > 0);
        console.log("wallet balance", res?.wallet_balance);
      })
      ?.catch((err: any) => {
        console.log("cartListApiManager error:", err);
        throw err;
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (userDetails?.id) {
        cartListApiManager();
      }
    });
    return unsubscribe;
  }, [navigation, userDetails?.id]);

  // --- MODIFIED FUNCTION ---
  const handleWalletCheck = (apply: boolean) => {
    if (!userDetails?.id || !cartBottomPrices?.cart_subtotal) {
      Toast.show({ type: "error", text1: "Cannot apply wallet right now." });
      return;
    }

    // 1. Optimistic UI Update: Change state immediately
    walletApplyApi({
      body: {
        user_id: userDetails.id,
        apply,
        cart_total: cartBottomPrices.cart_subtotal,
      },
    })
      ?.then(() => {
        // Toast.show({
        //   type: "success",
        //   text1: `Wallet ${apply ? "applied" : "removed"} successfully.`,
        // });
        // 3. Refresh with the source of truth from the server
        return cartListApiManager();
      })
      ?.catch((err: any) => {
        console.log("Wallet apply error:", err);
        // 2. Revert UI on failure
        setIsWalletApplied(!apply);
        Toast.show({
          type: "error",
          text1: "Failed to update wallet status.",
        });
      })
  };

  const handleWalletToggle = (apply: any) => {
    if (Number(cartBottomPrices?.wallet_balance || 0) < Number(cartBottomPrices?.total)) {
      setIsWalletApplied(apply);
    } else {
      Toast.show({
        type: "error",
        text1: "Cart total must be higher than wallet."
      })
    }
  };

  const removeCartManager = (cart_item_key: any) => {
    setLoading(true);
    removeCartItemCall({
      body: {
        cart_item_key,
        user_id: userDetails?.id
      },
    })
      ?.then(() => {
        Toast.show({
          type: "success",
          text1: "Course removed successfully.",
        });
        return cartListApiManager();
      })
      ?.catch((err: any) => {
        console.log("removeCartManager error", err);
        Toast.show({
          type: "error",
          text1: "Failed to remove course.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
    updateStatusOrderApi({
      body: {
        order_id,
        user_id: userDetails?.id,
        transaction_id,
        status,
      },
    })
      ?.then((res: any) => {
        console.log("updateOrderStatusManager res:", res);
        cartListApiManager();
      })
      ?.catch((err: any) => {
        console.log("updateOrderStatusManager err:", err);
      });
  };

  const payWithRazorpay = (userDetails: any, cartBottomPrices: any) => {
    setLoading(true);
    handleWalletCheck(isWalletApplied);
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
          amount: parseFloat(cartBottomPrices?.total || 0) * 100,
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
            Toast.show({
              type: "success",
              text1: "Payment successful!",
            });
            setLoading(false);
            updateOrderStatusManager(
              res?.data?.order_id,
              data?.razorpay_payment_id,
              "completed"
            );
          })
          .catch((error) => {
            Toast.show({
              type: "error",
              text1: "Payment failed",
              text2: error.description,
            });
            setLoading(false);
            updateOrderStatusManager(
              res?.data?.order_id,
              error?.details?.metadata?.payment_id,
              error?.details?.reason || "failed"
            );
          });
      })
      ?.catch((err) => {
        console.log("createOrderApi err:", err);
        Toast.show({
          type: "error",
          text1: "Could not create order. Please try again.",
        });
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
          keyExtractor={(item) => item.key}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          }
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {cartApiResponse?.length > 0 && (
          <View style={styles.footerContainer}>
            <View style={styles.orderInfoCard}>
              <Text style={styles.orderInfoTitle}>Order Info</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SubTotal</Text>
                <Text style={styles.infoValue}>
                  ₹{" "}
                  {parseFloat(cartBottomPrices?.cart_subtotal || 0).toFixed(2)}
                </Text>
              </View>
              {cartBottomPrices?.discount_name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Discount Name</Text>
                  <Text style={styles.infoValue}>
                    {cartBottomPrices?.discount_name}
                  </Text>
                </View>
              )}
              {parseFloat(cartBottomPrices?.discount_total || 0) > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Discount</Text>
                  <Text style={styles.infoValue}>
                    - ₹{" "}
                    {parseFloat(cartBottomPrices?.discount_total).toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Taxes</Text>
                <Text style={styles.infoValue}>
                  ₹ {parseFloat(cartBottomPrices?.taxes || 0).toFixed(2)}
                </Text>
              </View>

              {/* Wallet Section */}
              {parseFloat(cartBottomPrices?.wallet_balance || 0) > 0 && (
                <View style={styles.infoRow}>
                  <TouchableOpacity
                    style={styles.walletToggleContainer}
                    onPress={() => handleWalletToggle(!isWalletApplied)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.checkbox}>
                      {isWalletApplied && (
                        <View style={styles.checkboxChecked} />
                      )}
                    </View>
                    <Text style={styles.infoLabel}>
                      Use Wallet (Balance: ₹{" "}
                      {parseFloat(cartBottomPrices.wallet_balance).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {isWalletApplied &&
                parseFloat(cartBottomPrices?.wallet_discount || 0) > 0 && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Wallet Discount</Text>
                    <Text style={[styles.infoValue, styles.successText]}>
                      - ₹{" "}
                      {parseFloat(cartBottomPrices.wallet_discount).toFixed(2)}
                    </Text>
                  </View>
                )}

              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.totalLabel]}>Total</Text>
                <Text style={[styles.infoValue, styles.totalValue]}>
                  ₹{" "}
                  {isWalletApplied
                    ? (Number(cartBottomPrices?.total) -
                        Number(cartBottomPrices.wallet_balance) || 0)?.toFixed(2)
                    : parseFloat(cartBottomPrices?.total || 0).toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => payWithRazorpay(userDetails, cartBottomPrices)}
              disabled={loading || cartItemListApi?.isLoading}
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
    marginBottom: 10,
    alignItems: "center",
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
    fontSize: 16,
  },
  totalValue: {
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    fontSize: 16,
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
  walletToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  successText: {
    color: "#28a745", // Green color for success/discounts
    ...theme.font.fontMedium,
  },
});

export default CartScreen;
