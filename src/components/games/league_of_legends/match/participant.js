import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-elements";

import { avatarDefaultStyling } from "../../../../utils/styles";

const Participant = ({ participant }) => {
  const { summoner, stats, champion, role } = participant;
  console.log(summoner);

  const renderItem = ({ item }) => (
    <View style={{ margin: 3 }}>
      <Avatar
        size={22}
        title={item[0]}
        source={{ uri: item }}
        overlayContainerStyle={[avatarDefaultStyling, { borderRadius: 5 }]}
      />
    </View>
  );

  const itemKeyExtractor = (item) => {
    const split_arr = item.split("/");
    return split_arr[split_arr.length - 1];
  };

  return (
    <TouchableOpacity
      style={styles.container}
      //   onPress={() => {
      //     navigation.navigate("LolMatch", { match_id: match.id });
      //   }}
    >
      <View style={styles.avatar}>
        <Avatar
          size={55}
          rounded
          title={summoner.name[0]}
          source={{ uri: summoner.profile_icon }}
          overlayContainerStyle={avatarDefaultStyling}
        />
      </View>

      <View style={styles.stats}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 5 }}>
            <Avatar
              size={30}
              rounded
              title={champion.name[0]}
              source={{ uri: champion.image }}
              overlayContainerStyle={avatarDefaultStyling}
            />
          </View>
          <Text style={styles.summonerName}>{summoner.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", marginRight: 10 }}>
            <Text style={[styles.statsText, { color: "green" }]}>
              {stats.kills}
            </Text>
            <Text style={{ fontWeight: "bold" }}>/</Text>
            <Text style={[styles.statsText, { color: "red" }]}>
              {stats.deaths}
            </Text>
            <Text style={{ fontWeight: "bold" }}>/</Text>
            <Text style={[styles.statsText, { color: "goldenrod" }]}>
              {stats.assists}
            </Text>
          </View>
          <Text
            style={[
              styles.statsText,
              {
                color: "#b8bec3",
                fontWeight: "600",
              },
            ]}
          >
            {role.replace("_", " ")}
          </Text>
        </View>
      </View>
      <View style={styles.items}>
        <FlatList
          data={stats.items}
          renderItem={renderItem}
          keyExtractor={itemKeyExtractor}
          numColumns={Math.ceil(stats.items.length / 2)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: { paddingLeft: 5, paddingRight: 20 },
  stats: { flex: 3, justifyContent: "center", marginLeft: 40 },
  summonerName: { fontWeight: "bold", marginRight: 5 },
  statsText: { fontSize: 15, fontWeight: "bold" },
  items: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 5,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: 80,
    paddingLeft: 5,
    alignItems: "center",
  },
});

export default Participant;
