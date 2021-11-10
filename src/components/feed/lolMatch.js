import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Badge } from "react-native-elements";

import Stats from "../games/league_of_legends/match_history/match/stats";

import { dateTimeDiff } from "../../utils";
import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";

const Match = ({ participation }) => {
  const match = participation.participation;
  const navigation = useNavigation();
  const dateThen = new Date(match.creation);
  const dateDiff = dateTimeDiff(dateThen);

  const split_arr = match?.champion?.image?.split("/");

  const navigateProfile = () => {
    navigation.navigate("Profile", { username: participation.user.username });
  };

  const navigateMatch = () => {
    navigation.navigate("LolMatch", { match_id: match.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateMatch}>
      <View style={styles.content}>
        <TouchableOpacity
          style={{ flex: 9, flexDirection: "row", paddingTop: 5 }}
          onPress={navigateProfile}
        >
          <Avatar rounded source={{ uri: participation.user.picture }} on />
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.username}>{participation.user.username}</Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                rounded
                size={15}
                source={{ uri: participation.game.logo }}
                containerStyle={avatarDefaultStyling}
              />
              <Text style={styles.summoner_name}>
                {participation.summoner.name +
                  " #" +
                  participation.summoner.platform.replace(/[0-9]/g, "")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 11, flexDirection: "row" }}>
          <View style={styles.avatar}>
            <Avatar
              size={33}
              title={split_arr ? split_arr[split_arr.length - 1][0] : "C"}
              source={{ uri: match?.champion?.image }}
              overlayContainerStyle={[
                avatarDefaultStyling,
                { borderRadius: 10 },
              ]}
            />
            <Badge
              status={match.team.side === "R" ? "error" : "primary"}
              containerStyle={{
                position: "absolute",
                top: 23,
                left: 30,
                borderColor: darkTheme.background,
                borderRadius: 5,
                borderWidth: 2,
              }}
            />
          </View>
          <Stats match={match} />
        </View>
      </View>
      <View
        style={[
          styles.outcome,
          { backgroundColor: match.team.win ? "#32cd32" : "#ea3c53" },
        ]}
      >
        <Text style={[styles.outComeText, { fontSize: 25 }]}>
          {match.team.win ? "W" : "L"}
        </Text>
        <Text style={styles.outComeText}>{dateDiff} ago</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: { flex: 4 },
  username: { color: darkTheme.on_surface_title, fontWeight: "bold" },
  summoner_name: { paddingLeft: 5, color: darkTheme.on_surface_subtitle },
  avatar: { paddingRight: 20 },
  outComeText: { color: "white", fontSize: 11, fontWeight: "600" },
  outcome: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: 110,
    paddingLeft: 10,
    marginVertical: 5,
    backgroundColor: darkTheme.surface,
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Match;
