import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { darkTheme } from "../utils/theme";
import { shareApp } from "../utils/share";
import { openURL } from "../utils/link";

const ICON_SIZE = 20;

const ShnSocials = () => {
  const openSubReddit = () => {
    openURL("https://www.reddit.com/r/ShinobiApp/");
  };

  const openDiscord = () => {
    openURL(process.env.DISCORD_INVITE_LINK);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={openSubReddit}>
        <Ionicons
          name="logo-reddit"
          size={ICON_SIZE}
          color={darkTheme.on_surface_title}
        />
        <Text style={styles.text}>Reddit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable} onPress={openDiscord}>
        <MaterialCommunityIcons
          name="discord"
          size={ICON_SIZE}
          color={darkTheme.on_surface_title}
        />
        <Text style={styles.text}>Discord</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable} onPress={shareApp}>
        <Ionicons
          name="logo-google-playstore"
          size={ICON_SIZE}
          color={darkTheme.on_surface_title}
        />
        <Text style={styles.text}>Invite your friends!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  text: {
    color: darkTheme.on_background,
    fontSize: (8 * ICON_SIZE) / 10,
    marginLeft: 10,
  },
});

export default ShnSocials;
