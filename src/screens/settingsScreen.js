import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

import Content from "../settings/content";
import Cover from "../settings/cover";

import { darkTheme } from "../utils/theme";

const Settings = (props) => {
  const closeSettings = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Cover />
      <TouchableOpacity style={styles.closeButton} onPress={closeSettings}>
        <IonIcons name="close-outline" size={44} />
      </TouchableOpacity>
      <Content />
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: "19%",
    left: "50%",
    marginLeft: -22,
    backgroundColor: darkTheme.on_background,
    borderRadius: 22,
    zIndex: 1,
  },
  container: {
    position: "absolute",
    backgroundColor: darkTheme.on_background,
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
});

export default Settings;
