import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Avatar } from "react-native-elements";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import axios from "axios";

import { darkTheme } from "../../utils/theme";
import { handleAPIError } from "../../utils";
import { createAPIKit } from "../../utils/APIKit";
import { avatarDefaultStyling } from "../../utils/styles";
import { tabBarStyles } from "../home";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = 20;
const MAX_TITLE_LENGTH = 80;

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
  title,
  onChangeTitle,
  uploadVideo,
  selectedGame,
  setSelectedGame,
}) => {
  const navigation = useNavigation();
  const cancelTokenSource = axios.CancelToken.source();

  const [showSearchBar, setShowSearchBar] = React.useState(true);
  const [games, setGames] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [error, setError] = React.useState("");

  const _keyboardDidShow = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);

  const _keyboardDidHide = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: { display: "flex", ...tabBarStyles.tabBarStyle },
    });
  }, [navigation]);

  React.useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  React.useEffect(() => {
    const showListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const hideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    // cleanup function
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [_keyboardDidHide, _keyboardDidShow]);

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

  let searchStyle = {};
  let scrollStyle = {
    marginBottom: (2 - games.length) * 50,
  };
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
            onChangeTitle(newValue);
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
          <Text style={styles.gameName}>{selectedGame.name}</Text>
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
            <ScrollView keyboardShouldPersistTaps="handled" style={scrollStyle}>
              {games.map((game) => (
                <SearchGame game={game} key={game.id} onSelect={onSelectGame} />
              ))}
            </ScrollView>
          ) : (
            <View style={{ height: 40 }}>
              {error !== "" && <Text style={styles.error}>{error}</Text>}
            </View>
          )}
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
    height: height - 300,
    marginVertical: 20,
    justifyContent: "center",
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
  searchGame: {
    borderRadius: 10,
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
