import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { darkTheme } from "../../../utils/theme";

const CustomSwitch = ({ onSelectSwitch, toggleVal, selectionColor }) => {
  const iconSize = 20;
  return (
    <View style={[styles.container, { borderColor: selectionColor }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onSelectSwitch(1)}
        style={[
          styles.touchable,
          {
            backgroundColor:
              toggleVal == 1 ? selectionColor : darkTheme.surface,
          },
        ]}
      >
        <Icon
          type="ionicon"
          name="stats-chart"
          size={iconSize}
          color={toggleVal == 1 ? darkTheme.on_surface_title : selectionColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        TouchableOpacity
        activeOpacity={1}
        onPress={() => onSelectSwitch(2)}
        style={[
          styles.touchable,
          {
            backgroundColor:
              toggleVal == 2 ? selectionColor : darkTheme.surface,
          },
        ]}
      >
        <Icon
          type="ionicon"
          name="skull"
          size={iconSize}
          color={toggleVal == 2 ? darkTheme.on_surface_title : selectionColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    // width: 20,
    backgroundColor: darkTheme.surface,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    padding: 2,
  },
});

export default CustomSwitch;
