import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SplashScreen = ({ error }) => (
  <View style={styles.container}>
    <Text style={styles.text}>SPLASH SCREEN</Text>
    {error === "" && <Text>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 40 },
  error: { color: "red", fontWeight: "bold" },
});

export default SplashScreen;
