import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import axios from "axios";
import FastImage from "react-native-fast-image";

import { darkTheme } from "../utils/theme";
import { handleAPIError, MAX_TITLE_LENGTH } from "../utils";
import { avatarDefaultStyling } from "../utils/styles";
import Game from "../components/posts/game";
import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";

const ICON_SIZE = 20;

const EditPostScreen = ({ navigation, route }) => {
  const post = route?.params?.post;
  const cancelTokenSource = axios.CancelToken.source();

  const [disable, setDisable] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState(post.game);
  const [title, setTitle] = React.useState(post.title);

  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [games, setGames] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [error, setError] = React.useState("");

  const onChangeSearch = async (searchText) => {
    if (searchText == "") {
      setError("");
      setSearchText("");
      setGames([]);
      return;
    }
    const callback = async () => {
      const onSuccess = (response) => {
        const { games } = response.data?.payload;
        setGames(games);
        if (games.length === 0) {
          setError(
            "Sorry, we don't have that game. Let us know on Discord or Reddit"
          );
        }
      };

      const APIKit = await createAPIKit();
      APIKit.post(
        "/profile/games/search/",
        { search: searchText },
        { cancelToken: cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          setError(handleAPIError(e));
        });
    };

    setSearchText(searchText);
    setError("");
    callback();
  };

  const onSelectGame = (newSelectedGame) => {
    setSelectedGame(newSelectedGame);
    setSearchText("");
    setGames([]);
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
        name: "Feed",
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

  let searchStyle = {};

  if (games.length > 0) {
    searchStyle = styles.searchGame;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.inputParent, { marginBottom: 5 }]}>
        <MaterialCommunityIcons
          name="card-text"
          size={ICON_SIZE}
          color={darkTheme.on_background}
        />
        <TextInput
          editable={!disable}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color:
                title.length > MAX_TITLE_LENGTH
                  ? "red"
                  : darkTheme.on_background,
            },
          ]}
          placeholderTextColor={darkTheme.on_surface_subtitle}
          multiline
          placeholder="Clip Title"
          value={title}
          onChangeText={(value) => {
            const newValue = value.replace(/\s+/g, " ");
            setTitle(newValue);
          }}
        />
      </View>
      <Text
        style={[
          styles.count,
          {
            color:
              title.length > MAX_TITLE_LENGTH ? "red" : darkTheme.on_background,
          },
        ]}
      >
        {title.length}/{MAX_TITLE_LENGTH}
      </Text>
      {selectedGame && (
        <View style={styles.game}>
          <Avatar
            rounded
            size={24}
            title={selectedGame.name[0]}
            source={{ uri: selectedGame.logo_url }}
            containerStyle={avatarDefaultStyling}
            ImageComponent={FastImage}
          />
          <Text
            style={[styles.gameName, { color: darkTheme.on_surface_title }]}
          >
            {selectedGame.name}
          </Text>
          <Ionicons
            name="close-circle"
            style={styles.removeGame}
            size={24}
            color={darkTheme.on_background}
            onPress={onRemoveGame}
          />
        </View>
      )}

      {showSearchBar && (
        <View style={searchStyle}>
          <View style={styles.inputParent}>
            <Ionicons
              name="search"
              size={20}
              color={darkTheme.on_surface_subtitle}
            />
            <TextInput
              editable={!disable}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholderTextColor={darkTheme.on_surface_subtitle}
              multiline
              placeholder="Choose game"
              value={searchText}
              onChangeText={onChangeSearch}
            />
          </View>
          {games.length > 0 ? (
            <View keyboardShouldPersistTaps="handled">
              {games.map((game) => (
                <Game game={game} key={game.id} onSelect={onSelectGame} />
              ))}
            </View>
          ) : (
            <View style={{ height: 40 }}>
              {error !== "" && <Text style={styles.error}>{error}</Text>}
            </View>
          )}
        </View>
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
  error: { color: "red", flexShrink: 1 },
  clipLabel: {
    width: "100%",
    height: "20%",
  },
  inputParent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: darkTheme.surface,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    marginLeft: 5,
    width: "90%",
    height: "100%",
    color: darkTheme.on_background,
  },
  count: {
    alignSelf: "flex-end",
  },
  removeGame: { position: "absolute", right: 10 },
  gameName: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    color: darkTheme.on_surface_subtitle,
  },
  game: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    backgroundColor: darkTheme.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  searchGame: {
    borderRadius: 10,
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
