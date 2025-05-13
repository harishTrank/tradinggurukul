import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../../../../utils/theme";

const Accordian = (props) => {
  const [accStatus, setAccStatus] = React.useState({
    //data: props.data,
    expanded: false,
  });

  React.useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccStatus({ ...accStatus, expanded: !accStatus.expanded });
  };

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={toggleExpand}>
        <Text style={[styles.title, styles.font]}>{props.title}</Text>
        <Icon
          name={
            accStatus.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
          }
          size={30}
          color={theme.colors.text}
        />
      </TouchableOpacity>
      <View style={styles.parentHr} />
      {accStatus.expanded && <View style={styles.child}>{props.children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: theme.colors.text,
    ...theme.font.fontBold,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginHorizontal: 16,
    paddingRight: 18,
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: theme.colors.lightGray,
  },
  parentHr: {
    height: 1,
    color: theme.colors.text,
    width: "100%",
  },
  child: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
});

export default Accordian;
