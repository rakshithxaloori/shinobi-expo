import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Overlay } from "react-native-elements";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import { disconnectStyles } from "../styles";

const DisconnectTwitchOverlay = ({
  showOverlay,
  setShowOverlay,
  setConnected,
  setError,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const disconnect = async () => {
    setDisabled(true);
    const onSuccess = (response) => {
      setConnected(false);
      setDisabled(false);
      setShowOverlay(false);
    };

    const APIKit = await createAPIKit();
    APIKit.get("/socials/twitch/disconnect/", {
      cancelToken: cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        setError(handleAPIError(e));
        setDisabled(false);
        setShowOverlay(false);
      });
  };

  return (
    <Overlay
      isVisible={showOverlay}
      onBackdropPress={() => setShowOverlay(false)}
      overlayStyle={disconnectStyles.overlay}
    >
      <Text style={disconnectStyles.overlayTitle}>
        Are you sure? Disconnecting won't show Twitch link in your profile
      </Text>
      <View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={[disconnectStyles.button, disconnectStyles.disconnect]}
            disabled={disabled}
            onPress={disconnect}
          >
            <Text style={disconnectStyles.disconnectText}>
              Disconnect Twitch
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={[disconnectStyles.button, disconnectStyles.cancelButton]}
            onPress={() => setShowOverlay(false)}
          >
            <Text style={disconnectStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

export default DisconnectTwitchOverlay;
