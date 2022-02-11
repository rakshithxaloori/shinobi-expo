import { StyleSheet } from "react-native";

import { darkTheme } from "./theme";

export const avatarDefaultStyling = {
  backgroundColor: darkTheme.on_background,
};

export const shimmerColors = [darkTheme.surface, "#c5c5c5", darkTheme.surface];

export const tabBarStyles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    backgroundColor: darkTheme.background,
    elevation: 0,
    shadowOpacity: 0,
  },
});
