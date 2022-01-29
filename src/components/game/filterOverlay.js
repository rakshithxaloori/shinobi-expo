import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { Overlay } from "react-native-elements";

import { darkTheme } from "../../utils/theme";
import SearchGame from "./searchGame";
import SelectedGame from "./selectedGame";

const screenDimensions = Dimensions.get("screen");

const FilterOverlay = ({
  game,
  onRemoveGame,
  onSelectGame,
  isVisible,
  toggleOverlay,
}) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={toggleOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>Filter clips by game</Text>
      {game === null ? (
        <SearchGame onSelectGame={onSelectGame} disable={false} />
      ) : (
        <SelectedGame selectedGame={game} onRemoveGame={onRemoveGame} />
      )}
    </Overlay>
  );
};

const styles = StyleSheet.create({
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

export default FilterOverlay;
