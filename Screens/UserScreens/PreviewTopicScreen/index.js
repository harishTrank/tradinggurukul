import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import ContentPlayer from "../../Components/VideosCase/ContentPlayer";
import WebVideoPlayer from "../../Components/VideosCase/WebVideoPlayer";
import theme from "../../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PreviewTopicScreen = ({ navigation }) => {
  const topic = useSelector((state) => state.topic.activeTopic);

  const [coursesData, setCoursesData] = React.useState({
    activeTopic: null,
  });

  React.useEffect(() => {
    if (topic !== null) {
      setCoursesData({
        ...coursesData,
        activeTopic: topic,
      });
      console.log("coursesData", coursesData);
    } else {
      setCoursesData({
        ...coursesData,
        activeTopic: null,
      });
    }
  }, [topic]);

  const playerRender = () => {
    if (coursesData.activeTopic !== null) {
      if (coursesData.activeTopic.type === "video") {
        return <WebVideoPlayer videoUrl={coursesData.activeTopic.data} />;
      } else if (coursesData.activeTopic.type === "content") {
        return <ContentPlayer data={coursesData.activeTopic.data} />;
      } else {
        return (
          <Text style={{ color: theme.colors.text }}>Invalid Content</Text>
        );
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.parentContainer,
        {
          paddingTop: useSafeAreaInsets().top,
        },
      ]}
    >
      {coursesData.activeTopic !== null ? (
        <>
          <View style={styles.topInfoWrap}>
            <View>
              <Text style={styles.topInfoLabel}>Course Preview:</Text>
              <Text style={styles.topicTitleTxt}>
                {coursesData.activeTopic.title}
              </Text>
            </View>
          </View>
          <View style={styles.playerWrap}>{playerRender()}</View>
          <View style={{ marginVertical: 16, alignItems: "center" }}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleBack}>
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  padding: 16,
                  borderRadius: 30,
                  width: 150,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.white }}>
                  Return to Course
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.loadWrap}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  playerWrap: {
    height: 350,
  },
  scrollWrap: {
    flex: 2,
    flexGrow: 1,
  },
  headerWrapper: {
    backgroundColor: theme.colors.secondary,
  },
  topicInfoWrap: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  topicTitleTxt: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  topInfoWrap: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    flexDirection: "row",
  },
  topInfoLabel: {
    color: theme.colors.white,
    fontSize: 12,
    textTransform: "uppercase",
  },
  backWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 16,
  },
});

export default PreviewTopicScreen;
