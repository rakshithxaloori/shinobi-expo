import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { darkTheme } from "../../utils/theme";

const Cover = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>shinobi</Text>
      <Text style={styles.subtitle}>v. {Constants.manifest.version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: darkTheme.on_surface_title,
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    color: darkTheme.on_surface_title,
    fontSize: 30,
    fontWeight: "600",
  },
  container: {
    flex: 2,
    backgroundColor: darkTheme.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cover;
