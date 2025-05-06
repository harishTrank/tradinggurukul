// components/FilterModal.tsx (or wherever you place it)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import theme from "../../../../utils/theme";
import Checkbox from "../../../Components/CheckBox";

const { height, width } = Dimensions.get("window");

interface FilterOption {
  id: string;
  label: string;
}

const sortByOptions: FilterOption[] = [
  { id: "free", label: "Free classes" },
  { id: "premium", label: "Premium classes" },
  { id: "all_sort", label: "All" }, // Use unique ID
];

const levelOptions: FilterOption[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advacne" }, // Typo from image
];

const durationOptions: FilterOption[] = [
  { id: "0-1", label: "0-1 Hour" },
  { id: "1-3", label: "1-3 Hour" },
  { id: "3+", label: "3+ hour" },
];

// Props for the FilterModal
interface FilterModalProps {
  onClose: () => void; // Function to close the modal/view
  onApply: (filters: SelectedFilters) => void; // Function to apply filters
  initialFilters?: SelectedFilters; // Optional initial state
}

// Type for the selected filters state
interface SelectedFilters {
  sortBy: string | null;
  level: string | null;
  duration: string | null;
}

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onApply,
  initialFilters,
}) => {
  // State for selected filters
  const [selectedSortBy, setSelectedSortBy] = useState<string | null>(
    initialFilters?.sortBy ?? "free"
  ); // Default to 'free' based on image
  const [selectedLevel, setSelectedLevel] = useState<string | null>(
    initialFilters?.level ?? null
  );
  const [selectedDuration, setSelectedDuration] = useState<string | null>(
    initialFilters?.duration ?? null
  );

  // Function to render a section of filters
  const renderFilterSection = (
    title: string,
    options: FilterOption[],
    selectedValue: string | null,
    onSelect: (id: string | null) => void
  ) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionRow}
          onPress={() =>
            onSelect(option.id === selectedValue ? null : option.id)
          } // Toggle selection, allow deselecting
          activeOpacity={0.7}
        >
          <Checkbox
            isChecked={option.id === selectedValue}
            onPress={() =>
              onSelect(option.id === selectedValue ? null : option.id)
            }
          />
          <Text style={styles.optionLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleReset = () => {
    setSelectedSortBy("free"); // Reset to default or null
    setSelectedLevel(null);
    setSelectedDuration(null);
    // Optionally call onApply immediately with reset values or let user press Apply again
    // onApply({ sortBy: 'free', level: null, duration: null });
  };

  const handleApply = () => {
    const selectedFilters = {
      sortBy: selectedSortBy,
      level: selectedLevel,
      duration: selectedDuration,
    };
    console.log("Applying Filters:", selectedFilters);
    onApply(selectedFilters);
    onClose(); // Close modal after applying
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        {/* Optional Title Here */}
      </View>

      {/* Scrollable Filter Options */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderFilterSection(
          "Sort by",
          sortByOptions,
          selectedSortBy,
          setSelectedSortBy
        )}
        {renderFilterSection(
          "Level",
          levelOptions,
          selectedLevel,
          setSelectedLevel
        )}
        {renderFilterSection(
          "Duration",
          durationOptions,
          selectedDuration,
          setSelectedDuration
        )}
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderBottomWidth: 1, // Optional separator
    // borderBottomColor: theme.colors.lightGrey,
  },
  backButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1, // Takes up space between header and footer
  },
  scrollContentContainer: {
    paddingHorizontal: 20, // Padding for scrollable content
    paddingBottom: 20, // Space before the footer area
  },
  sectionContainer: {
    marginBottom: 25, // Space between filter sections
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18, // Space between options within a section
  },
  optionLabel: {
    fontSize: 16,
    color: theme.colors.black, // Adjust color as needed
    ...theme.font.fontRegular,
    marginLeft: 12, // Space between checkbox and label
    flexShrink: 1, // Allow label text to wrap if needed
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between", // Pushes buttons to edges
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGrey,
    backgroundColor: theme.colors.white, // Match background
  },
  resetButtonText: {
    fontSize: 16,
    color: theme.colors.primary, // Green color for Reset text
    ...theme.font.fontMedium,
    paddingHorizontal: 15, // Add padding for easier tapping
    paddingVertical: 5,
  },
  applyButton: {
    backgroundColor: theme.colors.primary, // Green background
    paddingVertical: 12,
    paddingHorizontal: 40, // Wider padding for Apply button
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: theme.colors.white, // White text
    ...theme.font.fontMedium,
  },
});

export default FilterModal;
