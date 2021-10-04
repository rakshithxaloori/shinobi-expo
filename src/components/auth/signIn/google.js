import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { SocialIcon } from "react-native-elements";
import axios from "axios";

import AuthContext from "../../../authContext";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { lightTheme } from "../../../utils/theme";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = ({ setError }) => {
  const { saveUser } = useContext(AuthContext);
  let cancelTokenSource = axios.CancelToken.source();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: process.env.EXPO_GOOGLE_CLIENT_ID,
    androidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  React.useEffect(() => {
    const onResponse = async () => {
      if (response?.type === "success") {
        const payload = { id_token: response.params.id_token };

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
    <SocialIcon
      button
      disabled={!request}
      title="Login with Google"
      type="google"
      onPress={() => {
        promptAsync();
      }}
      // iconColor={"orange"}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: lightTheme.primary },
});

export default GoogleSignIn;
