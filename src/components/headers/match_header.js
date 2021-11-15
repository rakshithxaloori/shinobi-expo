import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";

const MatchHeader = (props) => {
  const headerHeight = useHeaderHeight();
  console.log(props);
  const iconPress = () => {
    console.log("Icon Pressed");
  };

  return (
    <View style={[styles.container, { height: headerHeight }]}>
      <Text style={styles.title}>Match</Text>
      <Ionicons
        name="share-social"
        size={28}
        color={darkTheme.on_background}
        onPress={iconPress}
        style={styles.share}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: { color: darkTheme.on_background },
  share: { position: "absolute", right: 10 },
});

export default MatchHeader;
