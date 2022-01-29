import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Posts from "../components/posts";
import { darkTheme } from "../utils/theme";
import FilterOverlay from "../components/game/filterOverlay";

const ICON_SIZE = 25;

class ExploreScreen extends Component {
  state = {
    overlay_visible: false,
    game_id: null,
  };

  toggleOverlay = () => {
    this.setState((prevState) => ({
      overlay_visible: prevState.overlay_visible,
    }));
  };

  onSelectGame = (game) => {
    this.setState({ overlay_visible: false, game_id: game.id });
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleParent}>
        <Ionicons
          name="rocket"
          size={ICON_SIZE - 5}
          color={darkTheme.on_background}
        />
        <Text style={styles.title}>Explore</Text>
      </View>
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={() => {
          this.setState({ overlay_visible: true });
        }}
      >
        <Ionicons
          name="options"
          size={ICON_SIZE}
          color={darkTheme.on_background}
        />
      </TouchableOpacity>
    </View>
  );

  render = () => {
    return (
      <SafeAreaProvider style={styles.container}>
        <Posts
          type="Feed"
          feedType={1}
          renderHeader={this.renderHeader}
          game_id={this.state.game_id}
        />
        <FilterOverlay
          onSelectGame={this.onSelectGame}
          isVisible={this.state.overlay_visible}
          toggleOverlay={this.toggleOverlay}
        />
      </SafeAreaProvider>
    );
  };
}

const styles = StyleSheet.create({
  filterIcon: {
    position: "absolute",
    right: 0,
    padding: 10,
    borderRadius: ICON_SIZE,
    backgroundColor: darkTheme.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  titleParent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: darkTheme.on_background,
    fontSize: ICON_SIZE - 3,
    fontWeight: "bold",
    marginLeft: 5,
  },
  header: {
    flexDirection: "row",
    marginHorizontal: 15,
    height: ICON_SIZE + 30,
    backgroundColor: darkTheme.background,
  },
  container: { flex: 1, marginTop: 40 },
});

export default ExploreScreen;
