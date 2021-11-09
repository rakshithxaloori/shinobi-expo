import React from "react";
import { View, StyleSheet, Image } from "react-native";

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require("../../../assets/icon.png")}
      style={{ width: "60%", resizeMode: "contain" }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

export default SplashScreen;
