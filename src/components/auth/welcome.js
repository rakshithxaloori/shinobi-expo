import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { lightTheme } from "../../utils/theme";

const Auth = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>welcome to shinobi!</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.loginTouchable, styles.touchable]}
          onPress={() => {
            props.navigation.navigate("SignIn");
          }}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.signupTouchable, styles.touchable]}
          onPress={() => {
            props.navigation.navigate("SignUp");
          }}
        >
          <Text style={[styles.buttonText, styles.signupText]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 30, fontWeight: "bold" },
  buttonText: { fontWeight: "bold", fontSize: 15 },
  signupText: { color: "white" },
  touchable: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  loginTouchable: {
    backgroundColor: "#d3d3d3",
  },
  signupTouchable: {
    backgroundColor: lightTheme.primary,
  },
  buttons: { flexDirection: "row", marginTop: 20 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Auth;
