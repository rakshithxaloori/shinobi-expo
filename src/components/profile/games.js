import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import axios from "axios";

import { handleAPIError } from "../../utils";
import { createAPIKit } from "../../utils/APIKit";
import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";

const Games = ({ username }) => {
  const cancelTokenSource = axios.CancelToken.source();
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    const fetchGames = async () => {
      const onSuccess = (response) => {
        const { games } = response.data.payload;
        setGames(games);
      };

      const APIKit = await createAPIKit();
      APIKit.post(
        "/profile/games/get/",
        { username },
        {
          cancelToken: cancelTokenSource.token,
        }
      )
        .then(onSuccess)
        .catch((e) => {
          handleAPIError(e);
        });
    };

    fetchGames();

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  const renderGame = ({ item }) => (
    <View style={styles.game}>
      <Avatar
        rounded
        size={24}
        title={item.name[0]}
        source={{ uri: item.logo_url }}
        containerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <Text style={styles.gameName}>{item.name}</Text>
    </View>
  );

  const keyExtractor = (item) => item.id;

  return (
    <View style={styles.container}>
      {games.length > 0 && <Text style={styles.title}>Plays</Text>}
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontSize: 16,
    color: darkTheme.on_background,
    fontWeight: "bold",
  },
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
    marginRight: 8,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  container: {
    marginHorizontal: 15,
  },
});

export default Games;
