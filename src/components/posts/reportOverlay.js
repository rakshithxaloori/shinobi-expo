import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Overlay, CheckBox } from "react-native-elements";
import axios from "axios";

import { darkTheme } from "../../utils/theme";
import { createAPIKit } from "../../utils/APIKit";
import { flashAlert } from "../../utils/flash_message";
import { handleAPIError } from "../../utils";

const screenDimensions = Dimensions.get("screen");

const ReportOverlay = ({ post_id, hideReportOverlay }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [disabled, setDisabled] = React.useState(false);

  const [notPlay, setNotPlay] = React.useState(false);
  const [notGame, setNotGame] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const report = async () => {
    if (!notGame && !notPlay) {
      flashAlert("Nothing to report!");
      hideReportOverlay();
      return;
    }
    setDisabled(true);

    const onSuccess = (response) => {
      hideReportOverlay();
      flashAlert("Thank you for reporting!");
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      `/feed/post/report/`,
      { post_id, not_play: notPlay, not_game: notGame },
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
      isVisible={post_id !== undefined}
      onBackdropPress={hideReportOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>Report the clip?</Text>
      <Text style={styles.overlaySubtitle}>Something fishy with the clip?</Text>

      <View style={{ alignItems: "flex-start" }}>
        <CheckBox
          title="Not playing"
          checked={notPlay}
          onPress={() => setNotPlay(!notPlay)}
          checkedColor={darkTheme.on_background}
          containerStyle={styles.checkBox}
        />

        <CheckBox
          title="Not a gaming clip"
          checked={notGame}
          onPress={() => setNotGame(!notGame)}
          checkedColor={darkTheme.on_background}
          containerStyle={styles.checkBox}
        />
      </View>
      <View style={{ width: 200, height: 150, alignSelf: "center" }}>
        <TouchableOpacity
          style={[styles.button, styles.report]}
          disabled={disabled}
          onPress={report}
        >
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={hideReportOverlay}
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
    height: 350,
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

export default ReportOverlay;
