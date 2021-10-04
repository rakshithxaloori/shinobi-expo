import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import * as AuthSession from "expo-auth-session";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import DisconnectTwitchOverlay from "./disconnect";
import { lightTheme } from "../../../../utils/theme";

const Twitch = ({ connectedBool, setError }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);
  const [connected, setConnected] = React.useState(connectedBool);
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const sendToAPI = async (twitchToken) => {
    const APIKit = await createAPIKit();
    APIKit.post("/socials/twitch/connect/", { access_token: twitchToken })
      .then(() => setConnected(true))
      .catch((e) => {
        setError(handleAPIError(e));
      });
  };

  const signInWithTwitch = async () => {
    setDisabled(true);
    const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
    console.log(redirectUrl);
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=token&scope=user_read&force_verify=true`;
    const { type, params } = await AuthSession.startAsync({ authUrl });
    if (type === "success") {
      // console.log(params);
      // Object {
      //   "access_token": "743u8i5n7y861zlifx0rst2fr04seb",
      //   "exp://192.168.1.4:19000/--/expo-auth-session": "",
      //   "scope": "user_read",
      //   "token_type": "bearer",
      // }

      const { access_token } = params;
      sendToAPI(access_token).then(() => {
        setDisabled(false);
      });
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        style={styles.container}
        onPress={() => {
          if (connected) {
            // Show overlay, "ARE YOU SURE TO DISCONNECT?"
            setShowOverlay(true);
          } else signInWithTwitch();
        }}
      >
        <IonIcons name="logo-twitch" style={styles.icon} size={32} />
        <View style={styles.content}>
          <Text style={styles.title}>
            {connected ? "Disconnect Twitch" : "Connect Twitch"}
          </Text>
          <Text style={styles.text}>
            {connected ? "Removes" : "Shows"} your Twitch link in profile
          </Text>
        </View>
      </TouchableOpacity>
      <DisconnectTwitchOverlay
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        setConnected={setConnected}
        setError={setError}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: lightTheme.titleText,
    fontSize: 24,
    fontWeight: "600",
  },
  text: {
    color: lightTheme.titleText,
    fontWeight: "600",
    opacity: 0.6,
    marginTop: 5,
  },
  content: {
    paddingLeft: 20,
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
  },
});

export default Twitch;
