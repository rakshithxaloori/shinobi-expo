import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { darkTheme } from "../../utils/theme";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const sectionHeight = 15;
const sectionWidth = 90;

const Follow = (props) => {
  const { followers, following, profile_loaded } = props;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {profile_loaded ? (
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text style={styles.text}>Followers </Text>
            <Text style={[styles.text, styles.highlightText]}>{followers}</Text>
          </TouchableOpacity>
        ) : (
          <ShimmerPlaceHolder
            height={sectionHeight}
            width={sectionWidth}
            shimmerStyle={{ borderRadius: 10 }}
          />
        )}
      </View>
      <View style={styles.section}>
        {profile_loaded ? (
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text style={styles.text}>Following </Text>
            <Text style={[styles.text, styles.highlightText]}>{following}</Text>
          </TouchableOpacity>
        ) : (
          <ShimmerPlaceHolder
            height={sectionHeight}
            width={sectionWidth}
            shimmerStyle={{ borderRadius: 10 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    top: 50,
    left: 120,
  },
  section: {
    marginRight: 15,
    flexDirection: "row",
  },
  text: { fontSize: sectionHeight, color: darkTheme.on_surface_title },
  highlightText: { fontWeight: "bold" },
});

export default Follow;
