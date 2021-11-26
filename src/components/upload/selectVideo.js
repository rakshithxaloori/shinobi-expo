import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";
import VideoPlayer from "../../utils/uploadPlayer";

const ICON_SIZE = 25;

const SelectVideo = ({
  videoUri,
  videoHeight,
  disable,
  clearVideo,
  nextScreen,
  selectVideo,
  selectText,
}) => {
  return (
    <View style={styles.buttonsView}>
      {videoUri ? (
        <View>
          <VideoPlayer videoUri={videoUri} videoHeight={videoHeight} />
          <View style={styles.buttonsView}>
            <TouchableOpacity
              disabled={disable}
              onPress={clearVideo}
              style={[styles.button, styles.selectButton]}
            >
              <Ionicons
                style={styles.icon}
                name="trash-bin-outline"
                size={ICON_SIZE}
                color={darkTheme.on_background}
              />
              <Text style={[styles.buttonText, styles.selectText]}>
                Clear Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              onPress={nextScreen}
              style={[styles.button, styles.addTitleButton]}
            >
              <Ionicons
                style={styles.icon}
                name="document-text"
                size={ICON_SIZE}
                color={darkTheme.primary}
              />
              <Text style={[styles.buttonText, styles.addTitleText]}>
                Add Title
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          disabled={disable}
          onPress={selectVideo}
          style={[styles.button, styles.selectButton]}
        >
          <Ionicons
            style={styles.icon}
            name="albums-outline"
            size={ICON_SIZE}
            color={darkTheme.on_background}
          />
          <Text style={[styles.buttonText, styles.selectText]}>
            {selectText} Video
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsView: {
    margin: 10,
    flexDirection: "row",
  },
  icon: { marginRight: 8 },
  button: { borderRadius: 30, padding: 15, margin: 10, flexDirection: "row" },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  selectText: { color: darkTheme.on_background },
  addTitleText: { color: darkTheme.primary },
  selectButton: {
    backgroundColor: darkTheme.primary,
  },
  addTitleButton: {
    borderWidth: 2,
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.background,
  },
});

export default SelectVideo;
