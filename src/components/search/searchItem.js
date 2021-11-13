import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";

import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const screenWidth = Dimensions.get("screen").width;

const SearchItem = ({ profile, navigateProfile }) => {
  const { user, game_alias } = profile;
  return (
    <TouchableOpacity
      onPress={() => {
        navigateProfile(user.username);
      }}
      style={styles.container}
    >
      <Avatar
        rounded
        size={40}
        title={user.username[0]}
        source={{ uri: user.picture }}
        overlayContainerStyle={[styles.avatar, avatarDefaultStyling]}
        ImageComponent={FastImage}
      />
      <View style={styles.text}>
        <Text style={styles.title}>{user.username}</Text>
        <View style={styles.gameAlias}>
          <Avatar
            size={18}
            source={{ uri: game_alias.logo }}
            ImageComponent={FastImage}
          />
          <Text style={styles.subtitle}>{game_alias.alias}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  subtitle: {
    color: darkTheme.on_surface_subtitle,
    fontWeight: "600",
    fontSize: 13,
  },
  gameAlias: { flexDirection: "row" },
  text: { marginLeft: 15 },
  avatar: {
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    height: 45,
    width: screenWidth - 60,
    alignItems: "center",
  },
});

export default SearchItem;
