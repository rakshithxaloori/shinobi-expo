import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const TrendingProfile = ({ profile, navigateProfile }) => {
  const { user, game_alias, follower_count } = profile?.item;
  let follower_count_str = undefined;
  if (follower_count > 1000000)
    follower_count_str =
      (follower_count / 1000000).toFixed(2).toString() + " m";
  else if (follower_count > 1000)
    follower_count_str = (follower_count / 1000).toFixed(2).toString() + " k";
  else follower_count_str = follower_count.toFixed(2).toString();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigateProfile(user.username);
      }}
    >
      <Avatar
        size={66}
        title={user.username[0]}
        source={{ uri: user?.picture }}
        overlayContainerStyle={[styles.avatar, avatarDefaultStyling]}
      />
      <View style={styles.text}>
        <Text style={styles.title}>{user.username}</Text>
        {game_alias?.alias?.length > 0 && (
          <View style={styles.gameAlias}>
            <Avatar
              rounded
              size={18}
              source={{ uri: game_alias.logo }}
              containerStyle={avatarDefaultStyling}
            />
            <Text style={styles.subtitle}>{game_alias.alias}</Text>
          </View>
        )}
        <Text style={styles.subtitle}>
          {follower_count} {follower_count === 1 ? "follower" : "followers"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: darkTheme.on_surface_title,
  },
  subtitle: {
    color: darkTheme.on_surface_subtitle,
    paddingLeft: 3,
    fontWeight: "600",
    fontSize: 15,
  },
  gameAlias: { flexDirection: "row" },
  text: { marginLeft: 15 },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: darkTheme.surface,
  },
});

export default TrendingProfile;
