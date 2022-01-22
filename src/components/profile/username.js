import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { darkTheme } from "../../utils/theme";
import { shimmerColors } from "../../utils/styles";
import { getFlagLink } from "../../utils/link";
import { FLAG_ASPECT_RATIO } from "../../utils";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const height = 25;

const Username = ({ profile_loaded, user }) => (
  <View style={styles.container}>
    {profile_loaded ? (
      <>
        <Text style={styles.username}>{user?.username}</Text>
        {typeof user?.country_code === "string" && (
          <FastImage
            source={{ uri: getFlagLink(user?.country_code) }}
            style={styles.flag}
          />
        )}
      </>
    ) : (
      <ShimmerPlaceHolder
        height={height}
        shimmerStyle={{ borderRadius: 10 }}
        shimmerColors={shimmerColors}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: height,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: darkTheme.on_surface_title,
  },
  flag: {
    marginLeft: 5,
    height: height - 5,
    width: (height - 5) * FLAG_ASPECT_RATIO,
  },
});

export default Username;
