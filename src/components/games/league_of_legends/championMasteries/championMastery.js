import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Badge } from "react-native-elements";

import ChampionOverlay from "./championOverlay";
import { avatarDefaultStyling } from "../../../../utils/styles";
import { lightTheme } from "../../../../utils/theme";

const ChampionMastery = ({ championMastery, size }) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.champion} onPress={() => toggleOverlay()}>
        <Avatar
          title={championMastery.name[0]}
          source={{ uri: championMastery.image }}
          size={size}
          containerStyle={{ alignSelf: "center" }}
          overlayContainerStyle={avatarDefaultStyling}
          rounded
          // avatarStyle={{ borderRadius: 10 }}
        />
        <Badge
          status="error"
          containerStyle={{
            position: "absolute",
            top: 35,
            right: 5,
            borderColor: lightTheme.background,
            borderWidth: 1,
            borderRadius: 10,
          }}
          value={`Lv.${championMastery.level}`}
        />
        <Text style={styles.name}>{championMastery.name}</Text>
      </TouchableOpacity>
      <ChampionOverlay
        visible={visible}
        toggleOverlay={toggleOverlay}
        champion={championMastery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 5,
  },
  champion: { width: 80 },
  name: { alignSelf: "center", paddingTop: 8 },
});

export default ChampionMastery;
