import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Searchbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import FastImage from "react-native-fast-image";
import axios from "axios";

import { darkTheme } from "../../utils/theme";
import { handleAPIError } from "../../utils";
import { createAPIKit } from "../../utils/APIKit";
import { avatarDefaultStyling } from "../../utils/styles";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = 25;

const SearchGame = ({ game, onSelect }) => {
  const selectGame = () => {
    onSelect(game);
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

const TitleGame = ({
  is_uploading,
  disable,
  onChangeText,
  uploadVideo,
  selectedGame,
  setSelectedGame,
}) => {
  const cancelTokenSource = axios.CancelToken.source();

  const [showSearchBar, setShowSearchBar] = React.useState(true);
  const [games, setGames] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  onChangeSearch = async (searchText) => {
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

  let searchStyle = null;
  let scrollStyle = { marginTop: (2 - games.length) * 50 };
  if (games.length > 0) {
    searchStyle = {
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: darkTheme.on_background,
    };
  }

  return (
    <View style={styles.container}>
      <Input
        editable={!disable}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={80}
        placeholder="One tap headshots y'all!"
        label="Clip title"
        inputStyle={{ color: darkTheme.on_background, fontSize: 15 }}
        leftIcon={() => (
          <Ionicons name="film-outline" size={20} color={darkTheme.primary} />
        )}
        onChangeText={onChangeText}
        style={styles.clipLabel}
      />
      <View style={{ height: 40 }}>
        {error !== "" && <Text style={styles.error}>{error}</Text>}
      </View>
      {selectedGame && (
        <View>
          <Text style={[styles.gameName, { fontWeight: "bold" }]}>
            Game in the clip
          </Text>
          <View style={styles.game}>
            <Avatar
              rounded
              size={24}
              title={selectedGame.name[0]}
              source={{ uri: selectedGame.logo_url }}
              containerStyle={avatarDefaultStyling}
              ImageComponent={FastImage}
            />
            <Text style={styles.gameName}>{selectedGame.name}</Text>
            <Ionicons
              name="close-circle"
              style={styles.removeGame}
              size={24}
              color={darkTheme.on_background}
              onPress={onRemoveGame}
            />
          </View>
        </View>
      )}
      {showSearchBar && (
        <View style={[styles.searchBar, searchStyle]}>
          <ScrollView keyboardShouldPersistTaps="handled" style={scrollStyle}>
            {games.map((game) => (
              <SearchGame game={game} key={game.id} onSelect={onSelectGame} />
            ))}
          </ScrollView>
          <Searchbar
            placeholder="Choose game"
            onChangeText={onChangeSearch}
            value={searchText}
            icon={() => <Ionicons name="search" size={20} />}
          />
        </View>
      )}
      {is_uploading ? (
        <Text style={styles.uploadingText}>Uploading clip...</Text>
      ) : (
        <TouchableOpacity
          disabled={disable}
          onPress={uploadVideo}
          style={styles.uploadButton}
        >
          <Ionicons
            style={styles.icon}
            name="cloud-upload"
            size={ICON_SIZE}
            color={darkTheme.primary}
          />
          <Text style={styles.uploadText}>Upload Video</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: height / 2,
    marginVertical: 20,
  },
  error: { color: "red", flexShrink: 1 },
  searchBar: {
    marginVertical: 10,
    width: "100%",
    backgroundColor: darkTheme.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  clipLabel: {
    width: "100%",
    height: "20%",
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
    backgroundColor: darkTheme.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  icon: { marginRight: 8 },
  uploadingText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: darkTheme.primary,
    color: darkTheme.on_background,
    borderRadius: 30,
    padding: 15,
    margin: 20,
    alignSelf: "center",
  },
  uploadText: { fontSize: 18, fontWeight: "bold", color: darkTheme.primary },
  uploadButton: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 15,
    margin: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.background,
  },
});

export default TitleGame;
