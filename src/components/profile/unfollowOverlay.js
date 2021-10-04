import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import axios from "axios";

import { lightTheme } from "../../utils/theme";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";

const UnfollowOverlay = ({
  username,
  showOverlay,
  setFollowing,
  setShowOverlay,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const unfollow = async () => {
    setDisabled(true);

    const onSuccess = (response) => {
      setShowOverlay(false);
      setFollowing(false);
    };

    const APIKit = await createAPIKit();
    APIKit.get(`/profile/unfollow/${username}/`, {
      cancelToken: cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        setDisabled(false);
        console.log(handleAPIError(e));
      });
  };

  return (
    <Overlay
      isVisible={showOverlay}
      onBackdropPress={() => setShowOverlay(false)}
      overlayStyle={styles.overlay}
    >
      <Text style={styles.overlayTitle}>Unfollow {username}?</Text>
      <Text style={styles.overlaySubtitle}>
        You will no longer be able to chat. You can still view their profile,
        match history and in-game items.
      </Text>
      <View style={{ width: 200, height: 150 }}>
        <TouchableOpacity
          style={[styles.button, styles.unfollow]}
          disabled={disabled}
          onPress={unfollow}
        >
          <Text style={styles.unfollowText}>Unfollow</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={() => setShowOverlay(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  cancelText: {
    fontSize: 15,
    fontWeight: "bold",
    color: lightTheme.primary,
  },
  button: {
    height: 50,
    marginTop: 15,
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  cancel: {
    backgroundColor: "white",
    borderColor: lightTheme.primary,
    width: "100%",
    borderWidth: 2,
  },
  unfollowText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  unfollow: {
    backgroundColor: lightTheme.primary,
  },
  overlayTitle: {
    fontSize: 20,
    color: lightTheme.titleText,
    fontWeight: "bold",
  },
  overlaySubtitle: {
    fontSize: 16,
    marginHorizontal: 5,
    marginTop: 5,
    color: lightTheme.subtitleText,
    fontWeight: "500",
  },
  overlay: {
    height: 280,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default UnfollowOverlay;
