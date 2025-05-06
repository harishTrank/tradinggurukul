// components/Checkbox.tsx
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../utils/theme"; // Adjust path

interface CheckboxProps {
  isChecked: boolean;
  onPress: () => void;
  size?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  onPress,
  size = 22,
}) => {
  const iconSize = size * 0.7; // Adjust icon size relative to box

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.box,
        { width: size, height: size },
        isChecked && styles.checkedBox,
      ]}
      activeOpacity={0.7}
    >
      {isChecked && (
        <Feather name="check" size={iconSize} color={theme.colors.white} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: theme.colors.grey, // Default border color
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white, // Default background
  },
  checkedBox: {
    backgroundColor: theme.colors.primary, // Checked background color (e.g., blue from image)
    borderColor: theme.colors.primary, // Checked border color
  },
});

export default Checkbox;
