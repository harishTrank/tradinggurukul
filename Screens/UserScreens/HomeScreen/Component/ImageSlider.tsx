import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import theme from "../../../../utils/theme";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.92;

const LiveBlinkBadge = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.liveBadge, { opacity }]}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </Animated.View>
  );
};

const ImageSlider = ({ data, navigation }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.slide}
      onPress={() =>
        item?.isLiveSession
          ? navigation.navigate("LiveSessionPlayerScreen", { session: item })
          : navigation.navigate("AllCoursesSearch", { script: item })
      }
    >
      {item?.banner_url && (
        <Image
          source={{ uri: item?.banner_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {item?.isLiveSession && (
        <View style={styles.liveBadgeWrapper}>
          <LiveBlinkBadge />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_: any, index: any) => index}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={styles.flatlistContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />
      <View style={styles.pagination}>
        {data?.map((_: any, index: any) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex
                    ? theme.colors.primary
                    : theme.colors.grey,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  flatList: {},
  flatlistContent: {},
  slide: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.5,
    borderRadius: 15,
    overflow: "hidden",
  },
  liveBadgeWrapper: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53E3E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#fff",
    marginRight: 5,
  },
  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageSlider;
