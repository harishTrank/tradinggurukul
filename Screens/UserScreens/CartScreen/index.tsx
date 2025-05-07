// screens/CartScreen.tsx

import React, { useState, useMemo } from "react";
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

const initialCartData = [
  {
    id: "cart1",
    title: "Introduction to Digital Marketing",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.0,
    ratingCount: 351,
    price: 999,
  },
  {
    id: "cart2",
    title: "Advanced Stock Trading Strategies for Experts and Beginners",
    imageUrl: require("../../../assets/Images/dummy1.png"),
    rating: 4.8,
    ratingCount: 655,
    price: 999,
  },
];

interface OrderSummary {
  subTotal: number;
  discount: number;
  taxes: number;
  total: number;
}

const CartScreen = ({ navigation }: any) => {
  const [cartItems, setCartItems] = useState(initialCartData);

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setCartItems((prevItems) =>
              prevItems.filter((item) => item.id !== itemId)
            );
            console.log("Removed item:", itemId);
          },
        },
      ]
    );
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Your cart is empty. Please add courses to proceed."
      );
      return;
    }
    console.log("Proceeding to Checkout with items:", cartItems);
    console.log("Order Summary:", orderSummary);
  };

  const orderSummary: OrderSummary = useMemo(() => {
    const subTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = 0.0;
    const taxes = subTotal * 0.05;
    const total = subTotal - discount + taxes;
    return { subTotal, discount, taxes, total };
  }, [cartItems]);

  const renderCartItem = ({ item }: { item: (typeof initialCartData)[0] }) => (
    <CartItem item={item} onRemove={handleRemoveItem} />
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "android" && { paddingTop: useSafeAreaInsets().top },
      ]}
    >
      <StatusBar style="dark" />
      <HomeHeader
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log("Notifications pressed")}
        onCartPress={() => navigation.navigate("CartScreen")}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Cart</Text>

        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          }
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {cartItems.length > 0 && (
          <View style={styles.footerContainer}>
            <View style={styles.orderInfoCard}>
              <Text style={styles.orderInfoTitle}>Order Info</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SubTotal</Text>
                <Text style={styles.infoValue}>
                  ₹ {orderSummary.subTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Discount</Text>
                <Text style={styles.infoValue}>
                  ₹ {orderSummary.discount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Taxes</Text>
                <Text style={styles.infoValue}>
                  ₹ {orderSummary.taxes.toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, styles.totalLabel]}>Total</Text>
                <Text style={[styles.infoValue, styles.totalValue]}>
                  ₹ {orderSummary.total.toFixed(2)}
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
