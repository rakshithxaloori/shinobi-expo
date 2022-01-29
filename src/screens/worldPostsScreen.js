import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Posts from "../components/posts";
import { darkTheme } from "../utils/theme";

const ICON_SIZE = 25;

class WorldPostsScreen extends Component {
  state = {
    game_id: null,
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          //   borderWidth: 2,
          //   borderColor: "white",
        }}
      >
        <Ionicons
          name="rocket"
          size={ICON_SIZE - 5}
          color={darkTheme.on_background}
        />
        <Text style={styles.title}>Explore</Text>
      </View>
      <TouchableOpacity style={styles.filterIcon} onPress={() => {}}>
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
          //  game={{ id: "30035" }}
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

export default WorldPostsScreen;
