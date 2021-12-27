import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Input } from "react-native-elements";
import axios from "axios";

import GoogleSignUp from "./google";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";

const SignUp = ({ navigation }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const checkUsername = async (onSuccess) => {
    // Check username regex
    if (!username) {
      setError("Username can't be empty");
      return false;
    }
    if (username.length < 4) {
      setError("Username must contain atleast 4 characters");
      return false;
    }
    if (username.length > 30) {
      setError("Username must not contain more than 30 characters");
      return false;
    }
    let usernameFormat = /^\w(.)*$/;
    if (!usernameFormat.test(username)) {
      setError("Username must start with an alphanumeric character");
      return false;
    }
    usernameFormat = /^\w+([\w\d_.-])*$/;
    if (!usernameFormat.test(username)) {
      setError("Username can contain alphanumeric _ . - characters only");
      return false;
    }
    // Request API to see if username is available
    const APIKit = await createAPIKit();
    APIKit.post(
      "auth/check_username/",
      { username },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        setError(handleAPIError(e));
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>
        Choices make us who we are. So choose your username wisely, for it is
        eternal!
      </Text>
      <Input
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="eg: rock_lee"
        label="Username"
        leftIcon={{ type: "ionicons", name: "person-outline" }}
        onChangeText={(value) => {
          setError("");
          setUsername(value.trim());
        }}
        errorStyle={{ color: "red" }}
        errorMessage={error}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
        <Text style={styles.text}>
          By signing up, you agree to Shinobi's code -{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Terms");
          }}
        >
          <Text style={[styles.text, { textDecorationLine: "underline" }]}>
            Terms
          </Text>
        </TouchableOpacity>
        <Text style={styles.text}> and </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Privacy Policy");
          }}
        >
          <Text style={[styles.text, { textDecorationLine: "underline" }]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
      <GoogleSignUp
        setError={setError}
        disabled={disabled}
        setDisabled={setDisabled}
        username={username}
        checkUsername={checkUsername}
      />
      <StatusBar style={darkTheme.status_bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  quote: { paddingBottom: 20, fontWeight: "bold" },
  text: { fontSize: 12 },
});

export default SignUp;
