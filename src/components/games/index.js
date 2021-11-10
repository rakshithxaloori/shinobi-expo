import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

import LeagueOfLegendsProfile from "./league_of_legends";

const Games = ({ username, reload }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {games.map((game, index) => (
            <View style={styles.game} key={index}>
              <Avatar
                rounded
                size={24}
                title={game.name[0]}
                source={{ uri: game.logo }}
                containerStyle={avatarDefaultStyling}
              />
              <Text style={styles.gameName}>{game.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.gameProfile}>
        <LeagueOfLegendsProfile
          username={username}
          navigation={navigation}
          reload={reload}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  scroll: { flex: 1 },
  gameProfile: { flex: 6 },
  container: {
    flex: 7,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default Games;

const games = [
  {
    name: "League of Legends",
    logo: "https://ubuntuhandbook.org/wp-content/uploads/2018/09/lol-icon.png",
  },
];
