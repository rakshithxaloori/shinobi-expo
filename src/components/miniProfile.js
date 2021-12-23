import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

import { avatarDefaultStyling } from "../utils/styles";
import { darkTheme } from "../utils/theme";

const MiniProfile = ({ user }) => {
  const navigation = useNavigation();
  const navigateProfile = () => {
    navigation.push("Profile", { username: user.username });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateProfile}>
      <Avatar
        rounded
        size={44}
        title={user.username[0]}
        source={{ uri: user?.picture }}
        overlayContainerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <View style={styles.text}>
        <Text style={styles.title}>{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default MiniProfile;
