import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";
import { avatarDefaultStyling } from "../utils/styles";
import { flashAlert } from "../utils/flash_message";
import AuthContext from "../authContext";

const PlaysGame = ({ game, removeGame }) => {
  const rmGame = () => {
    removeGame(game.id);
  };
  return (
    <View style={styles.game}>
      <Avatar
        rounded
        size={24}
        title={game.name[0]}
        source={{ uri: game.logo_url }}
        containerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <Text style={styles.gameName}>{game.name}</Text>
      <Ionicons
        name="close-circle"
        style={styles.removeGame}
        size={24}
        color={darkTheme.on_background}
        onPress={rmGame}
      />
    </View>
  );
};

const SearchGame = ({ game, chooseGame }) => {
  const selectGame = () => {
    chooseGame(game);
  };
  return (
    <TouchableOpacity style={styles.game} onPress={selectGame}>
      <Avatar
        rounded
        size={24}
        title={game.name[0]}
        source={{ uri: game.logo_url }}
        containerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <Text style={styles.gameName}>{game.name}</Text>
    </TouchableOpacity>
  );
};

class ChangeGamesScreen extends Component {
  static contextType = AuthContext;
  state = {
    games: [],
    searchGames: [],
    search: "",
    loaded: false,
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchGames();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchGames = async () => {
    const onSuccess = (response) => {
      const { games } = response.data.payload;
      this.setState({ games, loaded: true });
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/profile/games/get/",
      { username: this.context.user.username },
      {
        cancelToken: this.cancelTokenSource.token,
      }
    )
      .then(onSuccess)
      .catch((e) => {
        handleAPIError(e);
      });
  };

  removeGame = async (game_id) => {
    const onSuccess = () => {
      const filteredList = this.state.games.filter(
        (item) => item.id !== game_id
      );
      this.setState({ games: filteredList });
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/profile/games/remove/",
      { game_id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  renderGame = ({ item }) => {
    return <PlaysGame game={item} removeGame={this.removeGame} />;
  };

  keyExtractor = (item) => item.id;

  onChangeSearch = async (searchText) => {
    if (searchText == "") {
      this.setState({ search: "", searchGames: [] });
      return;
    }
    const callback = async () => {
      const onSuccess = (response) => {
        const { games } = response.data?.payload;
        this.setState({ searchGames: games });
        if (games.length === 0) {
          flashAlert(
            "Sorry, we don't have that game",
            "Post on r/shinobi_app to let us know you want the game",
            undefined,
            5000
          );
        }
      };

      const APIKit = await createAPIKit();
      APIKit.post(
        "/profile/games/search/",
        { search: searchText },
        { cancelToken: this.cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          flashAlert(handleAPIError(e));
        });
    };

    this.setState({ search: searchText }, callback);
  };

  addGameToPlays = async (game) => {
    for (const iterGame of this.state.games) {
      if (iterGame.id == game.id) {
        flashAlert("Game is already added!");
        return;
      }
    }

    if (this.state.games.length >= 5) {
      flashAlert(
        "You can have upto 5 games",
        "Remove a game to make way for other games"
      );
      return;
    }

    const onSuccess = (response) => {
      this.setState((prevState) => ({
        search: "",
        searchGames: [],
        games: [game, ...prevState.games],
      }));
      Keyboard.dismiss();
    };

    console.log(game.id);
    const APIKit = await createAPIKit();
    APIKit.post(
      "/profile/games/add/",
      { game_id: game.id },
      { cancelToken: this.cancelTokenSource.token }
    ).then(onSuccess);
    // Finally clear search, searchGames
  };

  renderSearchGame = ({ item }) => {
    return <SearchGame game={item} chooseGame={this.addGameToPlays} />;
  };

  render = () => {
    let searchStyle = null;
    if (this.state.searchGames.length > 0)
      searchStyle = {
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: darkTheme.on_background,
      };
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You can add upto 5 games</Text>
        {this.state.loaded && (
          <>
            {this.state.games.length > 0 ? (
              <FlatList
                contentContainerStyle={styles.gamesList}
                data={this.state.games}
                renderItem={this.renderGame}
                keyExtractor={this.keyExtractor}
              />
            ) : (
              <Text style={styles.title}>
                Add games to show on your profile!
              </Text>
            )}
            <View style={[styles.searchBar, searchStyle]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {this.state.searchGames.map((game) => (
                  <SearchGame
                    game={game}
                    chooseGame={this.addGameToPlays}
                    key={game.id}
                  />
                ))}
              </ScrollView>
              <Searchbar
                placeholder="Search Games"
                onChangeText={this.onChangeSearch}
                value={this.state.search}
                icon={() => <Ionicons name="search" size={20} />}
              />
            </View>
          </>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  gameName: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    color: darkTheme.on_surface_subtitle,
  },
  removeGame: { position: "absolute", right: 10 },
  searchBar: {
    marginTop: 10,
    position: "absolute",
    bottom: 10,
    width: "100%",
    backgroundColor: darkTheme.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  game: {
    flexDirection: "row",
    height: 40,
    backgroundColor: darkTheme.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    color: darkTheme.on_surface_title,
    alignSelf: "center",
    fontWeight: "600",
    opacity: 0.6,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  container: { flex: 1 },
});

export default ChangeGamesScreen;
