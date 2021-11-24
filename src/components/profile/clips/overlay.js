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

import { darkTheme } from "../../../utils/theme";
import { createAPIKit } from "../../../utils/APIKit";
import { flashAlert } from "../../../utils/flash_message";
import { handleAPIError } from "../../../utils";

const screenDimensions = Dimensions.get("screen");

const DeleteOverlay = ({
  clip_id,
  showOverlay,
  toggleOverlay,
  deleteItemById,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const deleteClip = async () => {
    setDisabled(true);

    const onSuccess = (response) => {
      deleteItemById(clip_id);
      toggleOverlay();
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      `/clips/delete/`,
      { clip_id },
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
      onBackdropPress={toggleOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>Delete the clip?</Text>
      <Text style={styles.overlaySubtitle}>
        Deleting a clip, like a true breakup, is permanent and can't be undone
      </Text>

      <View style={{ width: 200, height: 150 }}>
        <TouchableOpacity
          style={[styles.button, styles.delete]}
          disabled={disabled}
          onPress={deleteClip}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={toggleOverlay}
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
    marginHorizontal: 5,
    marginTop: 5,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  checkBox: {
    backgroundColor: darkTheme.background,
    borderWidth: 0,
  },
  container: {
    height: 350,
    width: Math.min(300, screenDimensions.width - 100),
    backgroundColor: darkTheme.background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
});

export default DeleteOverlay;
