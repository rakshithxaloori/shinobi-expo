import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Overlay } from "react-native-elements";

import { darkTheme } from "../../utils/theme";
import { PLAY_STORE_LINK } from "../../utils/share";
import { openURL } from "../../utils/link";

const UpdatesOverlay = ({
  isVisible,
  updateAvailable,
  updates,
  setVisible,
}) => {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={isVisible}
      onBackdropPress={() => setVisible(false)}
    >
      {updateAvailable === true ? (
        <>
          <Text style={styles.header}>Update the app!</Text>
          <Text style={styles.updateText}>A new version is available.</Text>
          <Text style={styles.updateText}>
            Get the update for new features and bug fixes!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openURL(PLAY_STORE_LINK)}
          >
            <Text style={styles.buttonText}>Let's get it!</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.header}>New Updates!</Text>
          <Text style={styles.subtitle}>(v. {Constants.manifest.version})</Text>
          <View style={{ alignItems: "flex-start", alignSelf: "flex-start" }}>
            {updates.map((update, index) => (
              <Text key={index} style={styles.updateText}>
                {update}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.buttonText}>Yeah baby!</Text>
          </TouchableOpacity>
        </>
      )}
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 20,
    maxWidth: "80%",
    maxHeight: "90%",
    alignItems: "center",
    backgroundColor: darkTheme.background,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: darkTheme.on_background,
  },
  subtitle: { fontSize: 18, color: darkTheme.on_surface_subtitle },
  updateText: {
    fontSize: 18,
    color: darkTheme.on_surface_title,
    paddingVertical: 10,
  },
  button: {
    borderRadius: 5,
    backgroundColor: darkTheme.primary,
    padding: 10,
  },
  buttonText: {
    color: darkTheme.on_primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UpdatesOverlay;
