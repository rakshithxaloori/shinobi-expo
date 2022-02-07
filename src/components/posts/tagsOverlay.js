import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Overlay } from "react-native-elements";

import { darkTheme } from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import SearchItem from "../search/searchItem";

const screenDimensions = Dimensions.get("screen");

const TagsOverlay = ({ post, showOverlay, hideTagsOverlay }) => {
  const navigation = useNavigation();

  const navigateProfile = (username) =>
    navigation.navigate("Profile", { username: username });

  return (
    <Overlay
      isVisible={showOverlay}
      onBackdropPress={hideTagsOverlay}
      overlayStyle={styles.container}
    >
      <Text style={styles.overlayTitle}>
        Tagged in {post.posted_by.username}'s {post.game.name} clip
      </Text>
      <ScrollView>
        {post.tags.map((user) => (
          <SearchItem
            key={user.username}
            profile={{ user }}
            navigateProfile={navigateProfile}
          />
        ))}
      </ScrollView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayTitle: {
    alignSelf: "flex-start",
    fontSize: 15,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
    marginBottom: 5,
  },
  container: {
    height: 270,
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

export default TagsOverlay;
