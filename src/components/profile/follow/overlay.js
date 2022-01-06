import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Overlay } from "react-native-elements";
import axios from "axios";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";
import { flashAlert } from "../../../utils/flash_message";

const screenDimensions = Dimensions.get("screen");

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
        flashAlert(handleAPIError(e));
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
        You will no longer be able to chat. You can still view their profile.
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
    color: darkTheme.primary,
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
    backgroundColor: darkTheme.surface,
    borderColor: darkTheme.primary,
    width: "100%",
    borderWidth: 2,
  },
  unfollowText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  unfollow: {
    backgroundColor: darkTheme.primary,
  },
  overlayTitle: {
    fontSize: 20,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
  },
  overlaySubtitle: {
    fontSize: 16,
    marginHorizontal: 5,
    marginTop: 5,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  overlay: {
    height: 280,
    width: Math.min(300, screenDimensions.width - 100),
    backgroundColor: darkTheme.background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
});

export default UnfollowOverlay;
