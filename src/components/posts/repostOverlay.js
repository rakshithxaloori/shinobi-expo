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

import { darkTheme } from "../../utils/theme";
import { createAPIKit } from "../../utils/APIKit";
import { flashAlert } from "../../utils/flash_message";
import { handleAPIError } from "../../utils";

const screenDimensions = Dimensions.get("screen");

const RepostOverlay = ({ post, showOverlay, hideRepostOverlay }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const onPressRepost = async () => {
    setDisabled(true);

    const onSuccess = (response) => {
      hideRepostOverlay();
      flashAlert(`${post.posted_by.username}'s clip reposted!`);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      `/feed/post/repost/`,
      { post_id: post.id },
      {
        cancelToken: cancelTokenSource.token,
      }
    )
      .then(onSuccess)
      .catch((e) => {
        setDisabled(false);
        flashAlert(handleAPIError(e));
      });
  };

  return (
    <Overlay
      isVisible={showOverlay}
      onBackdropPress={hideRepostOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>
        Repost {post.posted_by.username}'s clip?
      </Text>
      <Text style={styles.overlaySubtitle}>
        Reposting shares the clip on your feed and your followers' feed
      </Text>

      <View style={{ width: 200, height: 150, alignSelf: "center" }}>
        <TouchableOpacity
          style={[styles.button, styles.report]}
          disabled={disabled}
          onPress={onPressRepost}
        >
          <Text style={styles.reportText}>Repost</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={hideRepostOverlay}
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
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cancel: {
    backgroundColor: darkTheme.surface,
    borderColor: darkTheme.primary,
    width: "100%",
    borderWidth: 2,
  },
  reportText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_background,
  },
  report: {
    backgroundColor: darkTheme.primary,
  },
  overlayTitle: {
    fontSize: 20,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
  },
  overlaySubtitle: {
    fontSize: 16,
    marginTop: 5,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  checkBox: {
    backgroundColor: darkTheme.background,
    borderWidth: 0,
  },
  container: {
    height: 270,
    width: Math.min(300, screenDimensions.width - 100),
    paddingHorizontal: 20,
    backgroundColor: darkTheme.background,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
});

export default RepostOverlay;
