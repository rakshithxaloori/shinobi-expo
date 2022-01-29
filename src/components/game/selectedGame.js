import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";

const SelectedGame = ({ selectedGame, onRemoveGame }) => (
  <View style={styles.container}>
    <Avatar
      rounded
      size={24}
      title={selectedGame.name[0]}
      source={{ uri: selectedGame.logo_url }}
      containerStyle={avatarDefaultStyling}
      ImageComponent={FastImage}
    />
    <Text style={[styles.gameName, { color: darkTheme.on_surface_title }]}>
      {selectedGame.name}
    </Text>
    <Ionicons
      name="close-circle"
      style={styles.removeGame}
      size={24}
      color={darkTheme.on_background}
      onPress={onRemoveGame}
    />
  </View>
);

const styles = StyleSheet.create({
  removeGame: { position: "absolute", right: 10 },
  gameName: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    color: darkTheme.on_surface_subtitle,
  },
  container: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    backgroundColor: darkTheme.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default SelectedGame;
