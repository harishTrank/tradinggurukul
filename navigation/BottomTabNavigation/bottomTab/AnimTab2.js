import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; // Changed import
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Platform,
} from "react-native";
import Icon, { Icons } from "../components/Icons";
import Colors from "../constants/Colors";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../../../Screens/UserScreens/HomeScreen";
import MyCoursesScreen from "../../../Screens/UserScreens/MyCoursesScreen";
import CommunityScreen from "../../../Screens/UserScreens/CommunityScreen";
import theme from "../../../utils/theme";

const TabArr = [
  {
    route: "HomeBottom",
    label: "Home",
    type: Icons.Feather,
    icon: "home",
    component: HomeScreen,
  },
  {
    route: "Courses",
    label: "Courses",
    type: Icons.Feather,
    icon: "book-open",
    component: MyCoursesScreen,
  },
  {
    route: "Community",
    label: "Community",
    type: Icons.Feather,
    icon: "users",
    component: CommunityScreen,
  },
];

const Tab = createMaterialTopTabNavigator();

const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -24 },
};
const animate2 = {
  0: { scale: 1.2, translateY: -24 },
  1: { scale: 1, translateY: 7 },
};

const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.9 },
  0.5: { scale: 0.2 },
  0.8: { scale: 0.7 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const isDarkMode = useColorScheme() === "dark";

  const { colors } = useTheme();
  const themeColor = isDarkMode ? Colors.white : Colors.black;
  const bgColor = colors.background;

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={500} style={styles.container}>
        <View
          style={[
            styles.btn,
            { borderColor: bgColor, backgroundColor: bgColor },
          ]}
        >
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Icon
            type={item.type}
            name={item.icon}
            color={focused ? Colors.white : Colors.primary}
          />
        </View>
        <Animatable.Text
          ref={textRef}
          style={[styles.text, { color: themeColor }]}
        >
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const MyCustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          height: Platform.OS === "ios" ? 70 : insets.bottom + 70,
        },
        theme.elevationHeavy,
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const tabArrItem = TabArr.find((item) => item.route === route.name);
        if (!tabArrItem) return null;
        return (
          <TabButton
            key={index}
            item={tabArrItem}
            onPress={onPress}
            accessibilityState={{ selected: isFocused }}
          />
        );
      })}
    </View>
  );
};

export default function AnimTab1() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingTop: Platform.OS === "android" ? insets.top : 0,
      }}
    >
      <Tab.Navigator
        tabBarPosition="bottom"
        tabBar={(props) => <MyCustomTabBar {...props} />}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
            />
          );
        })}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 5,
  },
  tabBar: {
    flexDirection: "row",
    elevation: 2,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
