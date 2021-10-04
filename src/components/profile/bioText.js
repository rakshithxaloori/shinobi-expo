import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const BioText = ({ profile_loaded, bio }) => {
  return (
    <View style={styles.bioText}>
      {profile_loaded ? (
        <Text>{bio}</Text>
      ) : (
        <ShimmerPlaceHolder width={180} shimmerStyle={{ borderRadius: 10 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bioText: {
    flexShrink: 1,
    position: "absolute",
    top: 160,
    left: 0,
  },
});

export default BioText;
