import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Participant from "./participant";

import { darkTheme } from "../../../../utils/theme";

const Team = ({ team }) => {
  const { participants, color, win } = team;

  const renderParticipant = ({ item }) => <Participant participant={item} />;
  const keyExtractor = (item) => item.summoner.name;

  return (
    <View
      style={[
        styles.container,
        {
          // backgroundColor: color === "B" ? "#89cff0" : "#ff5c5c",
          borderColor: color === "B" ? "#89cff0" : "#ff5c5c",
          borderWidth: 2,
          borderRadius: 10,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: color === "B" ? "#008ecc" : "#dc143c",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>{win === true ? "Win" : "Lose"}</Text>
      </View>
      <FlatList
        key={color}
        data={participants}
        renderItem={renderParticipant}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 5, borderRadius: 10 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: darkTheme.on_background,
    borderBottomColor: darkTheme.background,
    borderBottomWidth: 2,
  },
});

export default Team;
