import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Badge } from "react-native-elements";
import { dateTimeDiff } from "../../../../utils";

import { avatarDefaultStyling } from "../../../../utils/styles";
import { lightTheme } from "../../../../utils/theme";

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
          size={44}
          title={split_arr ? split_arr[split_arr.length - 1][0] : "C"}
          source={{ uri: match?.champion?.image }}
          overlayContainerStyle={[avatarDefaultStyling, { borderRadius: 7 }]}
        />
        <Badge
          status={match.team.side === "R" ? "error" : "primary"}
          containerStyle={{
            position: "absolute",
            top: 36,
            left: 40,
            borderColor: lightTheme.background,
            borderRadius: 5,
            borderWidth: 2,
          }}
        />
      </View>
      <View style={styles.stats}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.statsText,
              { color: "#b8bec3", fontWeight: "600", marginRight: 10 },
            ]}
          >
            {match.role.replace("_", " ")}
          </Text>
          <Text
            style={styles.statsText}
          >{`${match.stats.assists}a / ${match.stats.deaths}d / ${match.stats.kills}k`}</Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
          {match.stats.items.map((item, index) => (
            <Avatar
              key={index}
              size={24}
              title={item[0]}
              source={{ uri: item }}
              overlayContainerStyle={[
                avatarDefaultStyling,
                { borderRadius: 5, paddingRight: 3 },
              ]}
            />
          ))}
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
  avatar: { paddingLeft: 5, paddingRight: 20 },
  stats: { flex: 3 },
  statsText: { fontSize: 15, fontWeight: "bold" },
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
    height: 80,
    paddingLeft: 5,
    marginVertical: 5,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
  },
});

export default Match;
