import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Badge } from "react-native-elements";
import FastImage from "react-native-fast-image";

import ChampionOverlay from "./championOverlay";
import { avatarDefaultStyling } from "../../../../utils/styles";
import { darkTheme } from "../../../../utils/theme";

class ChampionMastery extends React.PureComponent {
  state = { visible: false };

  toggleOverlay = () => {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  };

  render = () => {
    const { championMastery, size } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.champion} onPress={this.toggleOverlay}>
          <Avatar
            title={championMastery.name[0]}
            source={{ uri: championMastery.image }}
            size={size}
            containerStyle={{ alignSelf: "center" }}
            overlayContainerStyle={avatarDefaultStyling}
            rounded
            ImageComponent={FastImage}
            // avatarStyle={{ borderRadius: 10 }}
          />
          <Badge
            status="error"
            containerStyle={styles.badge}
            value={`Lv.${championMastery.level}`}
          />
          <Text style={styles.name}>{championMastery.name}</Text>
        </TouchableOpacity>
        <ChampionOverlay
          visible={this.state.visible}
          toggleOverlay={this.toggleOverlay}
          champion={championMastery}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 5,
  },
  badge: {
    position: "absolute",
    top: 35,
    right: 5,
    borderColor: darkTheme.background,
    borderWidth: 1,
    borderRadius: 10,
  },
  champion: { width: 80 },
  name: { alignSelf: "center", paddingTop: 8, color: darkTheme.on_background },
});

export default ChampionMastery;
