import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { SocialIcon } from "react-native-elements";
import axios from "axios";

import AuthContext from "../../../authContext";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignUp = ({
  setError,
  disabled,
  setDisabled,
  username,
  checkUsername,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const { saveUser } = useContext(AuthContext);
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
        const payload = { username, id_token: response.params.id_token };

        const onSuccess = async (response) => {
          await saveUser(response.data?.payload);
        };

        const APIKit = await createAPIKit();
        APIKit.post("auth/signup/google/", payload, {
          cancelToken: cancelTokenSource.token,
        })
          .then(onSuccess)
          .catch((e) => {
            setDisabled(false);
            setError(handleAPIError(e));
          });
      }
    };

    onResponse();
  }, [response]);

  const submit = async () => {
    // If the username is available, the prompt is called
    const onSuccess = async () => {
      setDisabled(true);
      promptAsync();
    };
    await checkUsername(onSuccess);
  };

  return (
    <SocialIcon
      button
      disabled={!request || disabled}
      title="signup with google"
      type="google"
      onPress={() => {
        submit();
      }}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: darkTheme.primary },
});

export default GoogleSignUp;
