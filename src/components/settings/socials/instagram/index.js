import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import DisconnectInstagramOverlay from "./disconnect";
import { darkTheme } from "../../../../utils/theme";

const Instagram = ({ connectedBool, setError }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [connected, setConnected] = React.useState(connectedBool);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const sendToAPI = async (instagramCode) => {
    const APIKit = await createAPIKit();
    APIKit.post(
      "/socials/instagram/connect/",
      {
        authorization_code: instagramCode,
      },
      { cancelToken: cancelTokenSource.token }
    )
      .then(() => {
        setConnected(true);
      })
      .catch((e) => {
        setError(handleAPIError(e));
      });
  };

  const signInWithInstagram = async () => {
    setDisabled(true);
    const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${redirectUrl}&scope=user_profile&response_type=code`;
    const { type, params } = await AuthSession.startAsync({ authUrl });
    if (type === "success") {
      const { code } = params;
      sendToAPI(code).then(() => {
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
            setShowOverlay(true);
          } else {
            signInWithInstagram();
          }
        }}
      >
        <Ionicons
          name="logo-instagram"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>
            {connected ? "Disconnect Instagram" : "Connect Instagram"}
          </Text>
          <Text style={styles.text}>
            {connected ? "Removes" : "Shows"} your IG link in profile
          </Text>
        </View>
      </TouchableOpacity>
      <DisconnectInstagramOverlay
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

export default Instagram;
