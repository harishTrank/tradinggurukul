import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../../../utils/theme"; // Adjust this path to your theme file
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";

// Define the structure of a notification item
export interface Notification {
  type: 'doubt' | 'comment_reply';
  message: string;
  date: string;
  topic_id?: string;
  doubt_id?: string;
  doubt?: string;
  answer?: string;
  comment_id?: string;
  reply_id?: string;
  comment?: string;
  reply?: string;
}

const NotificationItem = ({ item }: { item: Notification }) => {
  const isDoubt = item.type === 'doubt';
  
  const renderIcon = () => {
    const iconName = isDoubt ? 'help-circle-outline' : 'comment-processing-outline';
    const iconColor = isDoubt ? theme.colors.secondary : theme.colors.primary;
    return (
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={theme.colors.white} />
      </View>
    );
  };

  const renderContent = () => {
    if (isDoubt) {
      return (
        <>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLabel}>Your Doubt:</Text>
            <Text style={styles.quoteText}>{item.doubt}</Text>
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLabel}>Answer:</Text>
            <Text style={styles.quoteText}>{item.answer}</Text>
          </View>
        </>
      );
    }
    return (
      <>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>Your Comment:</Text>
          <Text style={styles.quoteText}>{item.comment}</Text>
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>Reply:</Text>
          <Text style={styles.quoteText}>{item.reply}</Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {renderIcon()}
        <View style={styles.headerTextContainer}>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.dateText}>
            {moment(item.date).fromNow()}
          </Text>
        </View>
      </View>
      <View style={styles.contentSection}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    ...theme.font.fontSemiBold,
    color: theme.colors.black,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.grey,
    marginTop: 2,
  },
  contentSection: {
    marginTop: 15,
    paddingLeft: 55, // Align with text next to icon
  },
  quoteBox: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.lightGrey,
  },
  quoteLabel: {
    fontSize: 12,
    ...theme.font.fontMedium,
    color: theme.colors.grey,
    marginBottom: 2,
  },
  quoteText: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
  },
});

export default NotificationItem;