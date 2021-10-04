import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import GoogleSignIn from "./google";

import { windowWidthRatio } from "../../../utils/constants";

const SignIn = () => {
  const [error, setError] = useState("");
  // TODO force_verify true
  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error !== "" && error}</Text>
      <GoogleSignIn setError={setError} />
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
