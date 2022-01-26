import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";

import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const Game = ({ game, onSelect }) => {
  const selectGame = () => {
    onSelect(game);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={selectGame}>
      <Avatar
        rounded
        size={24}
        title={game.name[0]}
        source={{ uri: game.logo_url }}
        containerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <Text style={styles.gameName}>{game.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Game;
