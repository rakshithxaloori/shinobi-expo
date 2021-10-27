import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import { avatarDefaultStyling } from "../../../../utils/styles";
import { darkTheme } from "../../../../utils/theme";
import { flashAlert } from "../../../../utils/flash_message";

const Participant = ({ participant }) => {
  const navigation = useNavigation();
  const { summoner, stats, champion, role } = participant;

  const renderItem = ({ item }) => (
    <View style={{ margin: 3 }}>
      <Avatar
        size={22}
        title={item[0]}
        source={{ uri: item.image }}
        overlayContainerStyle={[avatarDefaultStyling, { borderRadius: 5 }]}
      />
    </View>
  );

  const itemKeyExtractor = (item) => String(item.key);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (summoner.username) {
          navigation.push("Profile", { username: summoner.username });
        } else {
          // Show alert profile doesn't exist
          flashAlert(`"${summoner.name}" is not on Shinobi yet`);
        }
      }}
    >
      <View style={styles.avatar}>
        <Avatar
          size={66}
          rounded
          title={summoner.name[0]}
          source={{ uri: summoner.profile_icon }}
          overlayContainerStyle={avatarDefaultStyling}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.summonerName}>{summoner.name}</Text>
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: 5 }}>
            <Avatar
              size={30}
              rounded
              title={champion.name[0]}
              source={{ uri: champion.image }}
              overlayContainerStyle={avatarDefaultStyling}
            />
          </View>
          {/* <Text style={styles.statsText}>{role.replace("_", " ")}</Text> */}
          <View style={styles.stats}>
            <Text
              style={[styles.statsText, { color: darkTheme.on_surface_title }]}
            >
              K / D / A
            </Text>
            <Text
              style={[
                styles.statsText,
                { color: darkTheme.on_surface_subtitle },
              ]}
            >{`${stats.kills} / ${stats.deaths} / ${stats.assists}`}</Text>
          </View>
          <View style={styles.items}>
            <FlatList
              data={stats.items}
              renderItem={renderItem}
              keyExtractor={itemKeyExtractor}
              numColumns={Math.ceil(stats.items.length / 2)}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: { paddingLeft: 5, paddingRight: 20 },
  stats: {
    flex: 2,
    justifyContent: "center",
    marginLeft: 40,
    alignItems: "center",
  },
  summonerName: {
    flex: 1,
    fontWeight: "bold",
    paddingTop: 10,
    marginRight: 5,
    color: darkTheme.on_surface_subtitle,
  },
  statsText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_surface_subtitle,
    fontWeight: "600",
  },
  items: {
    flex: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 5,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    paddingLeft: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
});

export default Participant;
