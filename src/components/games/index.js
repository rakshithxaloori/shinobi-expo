import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { avatarDefaultStyling } from "../../utils/styles";
import { lightTheme } from "../../utils/theme";

import LeagueOfLegendsProfile from "./league_of_legends";

const screenHeight = Dimensions.get("window").width;
console.log(screenHeight);

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
              <Text style={styles.text}>{game.name}</Text>
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
  text: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  game: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 40,
    paddingVertical: 12,
    marginRight: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 10,
  },
  scroll: { marginBottom: 30 },
  gameProfile: {},
  container: {
    // flex: 1,
    height: screenHeight,
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
