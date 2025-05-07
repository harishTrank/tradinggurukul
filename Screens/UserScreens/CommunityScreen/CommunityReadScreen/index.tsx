// Screens/UserScreens/ReadMoreScreen.tsx
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import theme from "../../../../utils/theme";

const staticPostData = {
  title: "Group Student Study",
  imageUrl: require("../../../../assets/Images/dummy1.png"),
  date: "Jan 25, 2025",
  fullDescription: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.35 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

Where can I get some?
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.

Paragraphs very dull texts to start with 'Lorem ipsum dolor sit amet...'`,
};
type RootStackParamList = {
  PreviousScreen: undefined;
  ReadMoreScreen: undefined;
};

type ReadMoreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReadMoreScreen"
>;

const CommunityReadScreen = () => {
  const navigation = useNavigation<ReadMoreScreenNavigationProp>();
  const post = staticPostData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Details
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={post.imageUrl} style={styles.postImage} />
        <View style={styles.contentPadding}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDate}>{post.date}</Text>
          <Text style={styles.postDescription}>{post.fullDescription}</Text>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey || "#ECECEC",
    backgroundColor: theme.colors.white,
  },
  backButton: {
    padding: 5,
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    color: theme.colors.black,
    ...theme.font.fontSemiBold,
    textAlign: "center",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 30,
  },
  postImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postTitle: {
    fontSize: 24,
    color: theme.colors.black,
    ...theme.font.fontBold,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 14,
    color: theme.colors.grey || "#888888",
    ...theme.font.fontRegular,
    marginBottom: 15,
  },
  postDescription: {
    fontSize: 16,
    color: theme.colors.text || theme.colors.black,
    ...theme.font.fontRegular,
    lineHeight: 24,
  },
});

export default CommunityReadScreen;
