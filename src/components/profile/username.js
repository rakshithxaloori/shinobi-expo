import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const height = 25;

const Username = ({ profile_loaded, username }) => (
  <View style={styles.username}>
    {profile_loaded ? (
      <Text style={styles.usernameText}>{username}</Text>
    ) : (
      <ShimmerPlaceHolder height={height} shimmerStyle={{ borderRadius: 10 }} />
    )}
  </View>
);

const styles = StyleSheet.create({
  username: {
    position: "absolute",
    top: 10,
    left: 120,
  },
  usernameText: {
    fontSize: height,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});

export default Username;
