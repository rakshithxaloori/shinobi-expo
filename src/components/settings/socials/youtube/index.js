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
import * as AuthSession from "expo-auth-session";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import { avatarDefaultStyling } from "../../../../utils/styles";
import DisconnectYouTubeOverlay from "./disconnect";
import { lightTheme } from "../../../../utils/theme";

const YouTube = ({ connectedBool, setError }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [connected, setConnected] = React.useState(connectedBool);
  const [accessToken, setAccessToken] = React.useState(undefined);
  const [disabled, setDisabled] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

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

  const signInWithYouTube = async () => {
    setDisabled(true);
    const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
    const scope = "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.EXPO_YOUTUBE_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=token&scope=${scope}&force_verify=true`;
    const { type, params } = await AuthSession.startAsync({ authUrl });
    if (type === "success") {
      const { access_token } = params;
      sendToAPI(access_token).then(() => {
        setDisabled(false);
      });
    } else {
      setDisabled(false);
    }
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
              />
              <Text style={styles.channelName}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Overlay>
      <TouchableOpacity
        disabled={disabled}
        style={styles.youtube}
        onPress={() => {
          if (connected) {
            // TODO show overlay with ARE YOU SURE?
            setShowOverlay(true);
          } else {
            signInWithYouTube();
          }
        }}
      >
        <IonIcons name="logo-youtube" style={styles.icon} size={32} />
        <View style={styles.content}>
          <Text style={styles.title}>
            {connected ? "Disconnect YouTube" : "Connect YouTube"}
          </Text>
          <Text style={styles.text}>
            {connected ? "Removes" : "Shows"} your YouTube channel in profile
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

  youtube: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
  },

  overlayTitle: {
    fontSize: 20,
    color: lightTheme.titleText,
    fontWeight: "bold",
  },
  overlaySubtitle: {
    fontSize: 16,
    color: lightTheme.subtitleText,
    fontWeight: "500",
  },
  overlayHeader: {
    alignSelf: "flex-start",
    paddingTop: 10,
  },

  channelName: {
    paddingLeft: 20,
    fontSize: 20,
    color: lightTheme.titleText,
    fontWeight: "bold",
  },
  channel: {
    padding: 7,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: lightTheme.subtitleText,
    flexDirection: "row",
    alignItems: "center",
  },
  channelsList: {
    alignSelf: "baseline",
    width: "100%",
  },
  overlay: {
    borderRadius: 5,
    width: Dimensions.get("window").width - 60,
    maxHeight: Dimensions.get("window").height - 100,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    // justifyContent: "center",
    alignItems: "center",
  },
});

export default YouTube;
