import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import axios from "axios";

import GoogleSignUp from "./google";

import { windowWidthRatio } from "../../../utils/constants";
import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";

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
      <GoogleSignUp
        setError={setError}
        disabled={disabled}
        setDisabled={setDisabled}
        username={username}
        checkUsername={checkUsername}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 50 * windowWidthRatio,
  },
});

export default SignUp;
