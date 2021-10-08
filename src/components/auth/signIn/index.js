import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import GoogleSignIn from "./google";

import { windowWidthRatio } from "../../../utils/constants";
import { darkTheme } from "../../../utils/theme";

const SignIn = () => {
  const [error, setError] = useState("");
  // TODO force_verify true
  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error !== "" && error}</Text>
      <GoogleSignIn setError={setError} />
      <StatusBar style={darkTheme.status_bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  error: { color: "red" },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 50 * windowWidthRatio,
  },
});

export default SignIn;
