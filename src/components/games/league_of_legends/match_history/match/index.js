import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Badge } from "react-native-elements";
import FastImage from "react-native-fast-image";

import { dateTimeDiff } from "../../../../../utils";
import { avatarDefaultStyling } from "../../../../../utils/styles";
import { darkTheme } from "../../../../../utils/theme";

import Stats from "./stats";

const Match = ({ match }) => {
  const navigation = useNavigation();
  const dateThen = new Date(match.creation);
  const dateDiff = dateTimeDiff(dateThen);

  const split_arr = match?.champion?.image?.split("/");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("LolMatch", { match_id: match.id });
      }}
    >
      <View style={styles.avatar}>
        <Avatar
          size={55}
          title={split_arr ? split_arr[split_arr.length - 1][0] : "C"}
          source={{ uri: match?.champion?.image }}
          overlayContainerStyle={[avatarDefaultStyling, { borderRadius: 7 }]}
          ImageComponent={FastImage}
        />
        <Badge
          status={match.team.side === "R" ? "error" : "primary"}
          containerStyle={{
            position: "absolute",
            top: 45,
            left: 50,
            borderColor: darkTheme.background,
            borderRadius: 5,
            borderWidth: 2,
          }}
        />
      </View>
      {/* <Text
        style={{
          color: darkTheme.on_surface_subtitle,
          fontWeight: "600",
          marginRight: 10,
        }}
      >
        {match.role.replace("_", " ")}
      </Text> */}
      <Stats match={match} />
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
  avatar: { paddingLeft: 5, paddingRight: 20 },
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
    height: 100,
    paddingLeft: 5,
    marginVertical: 5,
    backgroundColor: darkTheme.surface,
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Match;
