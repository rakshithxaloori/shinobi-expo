import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";

import AuthContext from "../../authContext";

const Cover = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>shinobi</Text>
      <Text style={styles.subtitle}>v. {Constants.manifest.version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { color: "white", fontSize: 18, fontWeight: "600" },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },
  container: {
    height: 213,
    backgroundColor: "#546bfb",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cover;
