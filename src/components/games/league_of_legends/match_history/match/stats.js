import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

import { avatarDefaultStyling } from "../../../../../utils/styles";
import { darkTheme } from "../../../../../utils/theme";

const Stats = ({ match }) => {
  const renderItem = ({ item }) => (
    <Avatar
      size={18}
      title={item[0]}
      source={{ uri: item.image }}
      overlayContainerStyle={[avatarDefaultStyling, styles.itemAvatar]}
    />
  );

  const keyItem = (item) => item.key;

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        <FlatList
          data={match.stats.items}
          renderItem={renderItem}
          keyExtractor={keyItem}
          numColumns={3}
        />
      </View>
      <View style={styles.stats}>
        <View style={{ flexDirection: "row" }}>
          <View>
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
            >{`${match.stats.kills} / ${match.stats.deaths} / ${match.stats.assists}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemAvatar: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: darkTheme.on_surface_title,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 2,
    borderColor: "white",
  },
  stats: {
    flex: 2,
    alignItems: "center",
  },
  statsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: { flex: 3, flexDirection: "row" },
});

export default Stats;
