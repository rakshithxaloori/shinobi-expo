import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { darkTheme } from "../../utils/theme";
import { shimmerColors } from "../../utils/styles";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const BioText = ({ profile_loaded, bio }) => {
  return (
    <View style={styles.container}>
      {profile_loaded ? (
        <Text style={styles.text}>{bio}</Text>
      ) : (
        <ShimmerPlaceHolder
          width={180}
          shimmerStyle={{ borderRadius: 10 }}
          shimmerColors={shimmerColors}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
  text: { color: darkTheme.on_surface_subtitle },
});

export default BioText;
