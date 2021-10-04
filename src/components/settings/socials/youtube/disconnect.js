import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import { lightTheme } from "../../../../utils/theme";

const DisconnectYouTubeOverlay = ({
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
    APIKit.get("/socials/youtube/disconnect/", {
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
      overlayStyle={styles.overlay}
    >
      <Text style={styles.overlayTitle}>
        Are you sure? Disconnecting won't show YouTube link in your profile
      </Text>
      <View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={[styles.button, styles.disconnect]}
            disabled={disabled}
            onPress={disconnect}
          >
            <Text style={styles.disconnectText}>Disconnect YouTube</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={[styles.button, styles.cancel]}
            onPress={() => setShowOverlay(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "bold",
    color: lightTheme.primary,
  },
  cancel: {
    backgroundColor: "white",
    borderColor: lightTheme.primary,
    borderWidth: 2,
  },
  disconnectText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  disconnect: {
    backgroundColor: lightTheme.primary,
  },
  overlayTitle: {
    fontSize: 15,
    color: lightTheme.titleText,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  overlay: {
    alignItems: "center",
    margin: 20,
  },
});

export default DisconnectYouTubeOverlay;
