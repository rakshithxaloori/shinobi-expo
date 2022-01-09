import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../utils/theme";

const ICON_SIZE = 32;

const Switch = ({ icon1_name, icon2_name, value, toggler }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        position: "absolute",
        right: 15,
        alignItems: "center",
        justifyContent: "center",
        width: 90,
        borderRadius: ICON_SIZE / 2,
        borderWidth: 2,
        borderColor: "white",
      }}
      onPress={toggler}
    >
      <Ionicons
        name={value === 1 ? icon1_name : icon1_name + "-outline"}
        size={ICON_SIZE}
        color={darkTheme.primary}
        style={[
          styles.icon,
          {
            backgroundColor:
              value === 1 ? darkTheme.surface : darkTheme.background,
          },
        ]}
      />
      <Ionicons
        name={value === 2 ? icon2_name : icon2_name + "-outline"}
        size={ICON_SIZE}
        color={darkTheme.primary}
        style={[
          styles.icon,
          {
            backgroundColor:
              value === 2 ? darkTheme.surface : darkTheme.background,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  icon: { paddingHorizontal: 5, borderRadius: ICON_SIZE / 2 },
});

export default Switch;
