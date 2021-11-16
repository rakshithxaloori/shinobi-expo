import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { Avatar, Overlay } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";
import FastImage from "react-native-fast-image";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import { avatarDefaultStyling } from "../../../../utils/styles";
import DisconnectYouTubeOverlay from "./disconnect";
import { darkTheme } from "../../../../utils/theme";

WebBrowser.maybeCompleteAuthSession();

const YouTube = ({ connectedBool, setError }) => {
  let cancelTokenSource = axios.CancelToken.source();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_GOOGLE_CLIENT_ID,
    androidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
    scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
    extraParams: { force_verify: "true" },
  });

  const [connected, setConnected] = React.useState(connectedBool);
  const [accessToken, setAccessToken] = React.useState(undefined);
  const [showOptions, setShowOptions] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(() => {
    if (response?.type === "success") {
      const { accessToken } = response?.authentication;
      sendToAPI(accessToken);
    }
    return () => {
      cancelTokenSource.cancel();
    };
  }, [response]);

  const sendToAPI = async (youTubeToken) => {
    const onSuccess = (response) => {
      if (response.status === 200) {
        setConnected(true);
      }
    };

    const loadOptions = ({ response }) => {
      setOptions(response.data?.payload?.channels);
      setShowOptions(true);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/socials/youtube/connect/",
      { access_token: youTubeToken },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        if (!axios.isCancel(e) && e.response.status === 300) {
          loadOptions(e);
          setAccessToken(youTubeToken);
        } else setError(handleAPIError(e));
      });
  };

  const chooseChannel = async (channel_id) => {
    const onSuccess = (response) => {
      setShowOptions(false);
      setConnected(true);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/profile/youtube/select/",
      {
        access_token: accessToken,
        channel_id,
      },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        setError(handleAPIError(e));
      });
  };

  return (
    <View>
      <Overlay
        isVisible={showOptions}
        onBackdropPress={() => setOptions(false)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.overlayHeader}>
          <Text style={styles.overlayTitle}>Choose one YouTube channel</Text>
          <Text style={styles.overlaySubtitle}>
            You can only connect one channel to your profile
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.channelsList}
        >
          {options.map((channel, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => chooseChannel(channel.id)}
              style={styles.channel}
            >
              <Avatar
                rounded
                title={channel.name[0]}
                source={{ uri: channel.thumbnail?.url }}
                size={66}
                overlayContainerStyle={avatarDefaultStyling}
                ImageComponent={FastImage}
              />
              <Text style={styles.channelName}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Overlay>
      <TouchableOpacity
        disabled={!request}
        style={styles.youtube}
        onPress={() => {
          if (connected) {
            setShowOverlay(true);
          } else {
            promptAsync();
          }
        }}
      >
        <IonIcons
          name="logo-youtube"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>
            {connected ? "Disconnect YouTube" : "Connect YouTube"}
          </Text>
          <Text style={styles.text}>
            {connected ? "Removes" : "Shows"} your YT channel link in profile
          </Text>
        </View>
      </TouchableOpacity>
      <DisconnectYouTubeOverlay
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        setConnected={setConnected}
        setError={setError}
      />
    </View>
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

  youtube: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
  },

  overlayTitle: {
    fontSize: 20,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
  },
  overlaySubtitle: {
    fontSize: 16,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  overlayHeader: {
    alignSelf: "flex-start",
    paddingTop: 10,
  },

  channelName: {
    paddingLeft: 20,
    fontSize: 20,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
  },
  channel: {
    padding: 7,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: darkTheme.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  channelsList: {
    alignSelf: "baseline",
    width: "100%",
  },
  overlay: {
    width: Dimensions.get("window").width - 60,
    maxHeight: Dimensions.get("window").height - 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkTheme.background,
    borderColor: darkTheme.on_background,
    borderWidth: 1,
    borderRadius: 10,
  },

  container: {
    alignItems: "center",
  },
});

export default YouTube;
