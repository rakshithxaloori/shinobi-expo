import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import Content from "../components/settings/content";
import Cover from "../components/settings/cover";

import { darkTheme } from "../utils/theme";

const Settings = (props) => {
  const closeSettings = () => {
    props.navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Cover />
      <TouchableOpacity style={styles.closeButton} onPress={closeSettings}>
        <Ionicons name="close-outline" size={44} />
      </TouchableOpacity>
      <Content />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 140 - Constants.statusBarHeight,
    left: "50%",
    marginLeft: -22,
    backgroundColor: darkTheme.on_background,
    borderRadius: 22,
    zIndex: 1,
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

export default Settings;
