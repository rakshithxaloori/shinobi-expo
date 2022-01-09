import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { darkTheme } from "../utils/theme";
import { shareApp } from "../utils/share";

const ShnSocials = () => {
  const linkURL = async (URL) => {
    try {
      Linking.openURL(URL);
    } catch (error) {
      console.log(error);
    }
  };

  const openSubReddit = () => {
    linkURL("https://www.reddit.com/r/ShinobiApp/");
  };

  const openDiscord = () => {
    linkURL(process.env.DISCORD_INVITE_LINK);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.socialIcon} onPress={openSubReddit}>
        <Ionicons
          name="logo-reddit"
          size={33}
          color={darkTheme.on_surface_title}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon} onPress={openDiscord}>
        <MaterialCommunityIcons
          name="discord"
          size={33}
          color={darkTheme.on_surface_title}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon} onPress={shareApp}>
        <Ionicons
          name="share-social"
          size={33}
          color={darkTheme.on_surface_title}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  socialIcon: { alignItems: "center", paddingHorizontal: 10 },
});

export default ShnSocials;
