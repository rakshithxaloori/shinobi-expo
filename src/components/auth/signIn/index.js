import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import GoogleSignIn from "./google";

import { darkTheme } from "../../../utils/theme";

const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error !== "" && error}</Text>
      <GoogleSignIn />
      <StatusBar style={darkTheme.status_bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  error: { color: "red" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignIn;
