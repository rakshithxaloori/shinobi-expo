import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";

import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const screenWidth = Dimensions.get("screen").width;

const SearchItem = ({ profile, navigateProfile }) => {
  const { user } = profile;
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
        overlayContainerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <Text style={styles.title}>{user.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: darkTheme.on_background,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 15,
  },
  container: {
    flexDirection: "row",
    height: 45,
    width: screenWidth - 60,
    alignItems: "center",
  },
});

export default SearchItem;
