import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import Game from "./game";
import { darkTheme } from "../../utils/theme";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";

const SearchGame = ({ onSelectGame, disable }) => {
  const cancelTokenSource = axios.CancelToken.source();

  const [searchText, setSearchText] = React.useState("");
  const [error, setError] = React.useState("");
  const [games, setGames] = React.useState([]);

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
            "Sorry, we don't have that game. Click on 'Request a game' to let us know"
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

  let scrollStyle = {
    marginBottom: (2 - games.length) * 50,
  };
  return (
    <View style={styles.container}>
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
        <View keyboardShouldPersistTaps="handled" style={scrollStyle}>
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
  );
};

const styles = StyleSheet.create({
  error: { color: "red", flexShrink: 1, paddingHorizontal: 10 },
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
  container: {
    borderRadius: 10,
  },
});

export default SearchGame;
