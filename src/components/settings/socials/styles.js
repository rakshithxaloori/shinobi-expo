import { StyleSheet } from "react-native";

import { darkTheme } from "../../../utils/theme";

export const disconnectStyles = StyleSheet.create({
  button: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_surface_title,
  },
  cancelButton: {
    backgroundColor: darkTheme.surface,
    borderColor: darkTheme.primary,
    borderWidth: 2,
  },
  disconnectText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_primary,
  },
  disconnect: {
    backgroundColor: darkTheme.primary,
  },
  overlayTitle: {
    fontSize: 15,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  overlay: {
    alignItems: "center",
    margin: 20,
    backgroundColor: darkTheme.background,
    borderColor: darkTheme.on_background,
    borderWidth: 1,
    borderRadius: 10,
  },
});
