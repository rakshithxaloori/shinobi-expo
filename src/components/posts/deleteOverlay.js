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

const DeleteOverlay = ({
  post,
  showOverlay,
  hideDeleteOverlay,
  deletePostFromList,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const deletePost = async () => {
    setDisabled(true);

    const onSuccess = (response) => {
      deletePostFromList(post);
      hideDeleteOverlay();
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      `/feed/post/delete/`,
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
      onBackdropPress={hideDeleteOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>
        Delete the {post.is_repost ? "repost" : "post"}?
      </Text>
      <Text style={styles.overlaySubtitle}>
        {post.is_repost
          ? "Deleting a repost removes it from your feed and your follwers' feed"
          : "Deleting a post also deletes the clip permanently"}
      </Text>

      <View style={{ width: 200, height: 150, alignSelf: "center" }}>
        <TouchableOpacity
          style={[styles.button, styles.delete]}
          disabled={disabled}
          onPress={deletePost}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={hideDeleteOverlay}
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
  deleteText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_background,
  },
  delete: {
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
    height: 250,
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

export default DeleteOverlay;
