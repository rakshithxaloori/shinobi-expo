import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Asset } from "expo-asset";
import { Avatar } from "react-native-elements";
import axios from "axios";

import AuthContext from "../../../authContext";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = ({ setError }) => {
  const { saveUser } = useContext(AuthContext);
  let cancelTokenSource = axios.CancelToken.source();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_GOOGLE_CLIENT_ID,
    androidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
    extraParams: { force_verify: "true" },
  });

  const imageURI = Asset.fromModule(
    require("../../../../assets/google-icon.png")
  ).uri;

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  React.useEffect(() => {
    const onResponse = async () => {
      if (response?.type === "success") {
        const payload = {
          access_token: response.params.access_token,
        };

        const onSuccess = async (response) => {
          await saveUser(response.data?.payload);
        };

        const APIKit = await createAPIKit();
        APIKit.post("auth/login/google/", payload, {
          cancelToken: cancelTokenSource.token,
        })
          .then(onSuccess)
          .catch((e) => {
            setError(handleAPIError(e));
          });
      }
    };

    onResponse();
  }, [response]);

  return (
    imageURI && (
      <TouchableOpacity
        disabled={!request}
        style={styles.button}
        onPress={() => {
          promptAsync();
        }}
      >
        <Avatar
          source={{ uri: imageURI }}
          size={40}
          avatarStyle={styles.icon}
        />
        <Text style={styles.text}>Sign in with Google</Text>
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: "white",
    paddingLeft: 8,
  },
  icon: { borderRadius: 10 },
  button: {
    flexDirection: "row",
    paddingRight: 8,
    backgroundColor: "#4285f4",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
  },
});

export default GoogleSignIn;
