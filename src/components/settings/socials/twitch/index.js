import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import DisconnectTwitchOverlay from "./disconnect";
import { darkTheme } from "../../../../utils/theme";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
  tokenEndpoint: "https://id.twitch.tv/oauth2/token",
  revocationEndpoint: "https://id.twitch.tv/oauth2/revoke",
};

const Twitch = ({ connectedBool, setError }) => {
  let cancelTokenSource = axios.CancelToken.source();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.TWITCH_CLIENT_ID,
      redirectUri: makeRedirectUri({
        native: "cc.shinobi.android:/oauthredirect",
      }),
      scopes: ["user_read"],
      responseType: "token",
      extraParams: { force_verify: "true" },
    },
    discovery
  );

  console.log(request);

  // const [disabled, setDisabled] = React.useState(false);
  const [connected, setConnected] = React.useState(connectedBool);
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(() => {
    console.log("RESPONSE", response);
    if (response?.type === "success") {
      console.log(response);
      const { code } = response.params;
      sendToAPI(code).then(() => {
        setDisabled(false);
      });
    }
    return () => {
      cancelTokenSource.cancel();
    };
  }, [response]);

  const sendToAPI = async (twitchToken) => {
    const APIKit = await createAPIKit();
    APIKit.post("/socials/twitch/connect/", { access_token: twitchToken })
      .then(() => setConnected(true))
      .catch((e) => {
        setError(handleAPIError(e));
      });
  };

  return (
    <>
      <TouchableOpacity
        disabled={!request}
        style={styles.container}
        onPress={() => {
          if (connected) {
            setShowOverlay(true);
          } else promptAsync();
        }}
      >
        <Ionicons
          name="logo-twitch"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
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
    color: darkTheme.on_surface_title,
    fontSize: 24,
    fontWeight: "600",
  },
  text: {
    color: darkTheme.on_surface_title,
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
