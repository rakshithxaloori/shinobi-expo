import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../utils/theme";
import { handleAPIError } from "../utils";
import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import SearchGame from "../components/game/searchGame";
import SelectedGame from "../components/game/selectedGame";
import PostTitle from "../components/posts/postTitle";

const ICON_SIZE = 20;

const EditPostScreen = ({ navigation, route }) => {
  const post = route?.params?.post;

  const [disable, setDisable] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState(post.game);
  const [title, setTitle] = React.useState(post.title);

  const [showSearchBar, setShowSearchBar] = React.useState(false);

  const onSelectGame = (newSelectedGame) => {
    setSelectedGame(newSelectedGame);
    setShowSearchBar(false);
  };

  const onRemoveGame = () => {
    if (disable) return;
    setSelectedGame(null);
    setShowSearchBar(true);
  };

  const updatePost = async () => {
    setDisable(true);
    const onSuccess = () => {
      navigation.navigate({
        name: "World Posts",
        params: {
          type: "update",
          updatedPost: { id: post.id, game: selectedGame, title },
        },
      });
    };
    const APIKit = await createAPIKit();
    APIKit.post("feed/post/update/", {
      post_id: post.id,
      title,
      game_id: selectedGame.id,
    })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
        setDisable(false);
      });
  };

  return (
    <View style={styles.container}>
      <PostTitle title={title} onChangeTitle={setTitle} disable={disable} />
      {selectedGame && (
        <SelectedGame selectedGame={selectedGame} onRemoveGame={onRemoveGame} />
      )}

      {showSearchBar && (
        <SearchGame onSelectGame={onSelectGame} disable={disable} />
      )}
      <TouchableOpacity
        disabled={disable}
        onPress={updatePost}
        style={styles.updateBtn}
      >
        <Ionicons
          style={styles.icon}
          name="heart-half"
          size={ICON_SIZE}
          color={darkTheme.on_primary}
        />
        <Text style={styles.updateTxt}>Update Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { marginRight: 8 },
  updateTxt: { fontSize: 18, fontWeight: "bold", color: darkTheme.on_primary },
  updateBtn: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 15,
    margin: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: darkTheme.primary,
  },
});

export default EditPostScreen;
