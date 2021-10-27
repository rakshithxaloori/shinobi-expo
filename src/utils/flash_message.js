import { showMessage } from "react-native-flash-message";
import { darkTheme } from "./theme";

export const flashAlert = (message, description = "", big = false) => {
  showMessage({
    message: message,
    type: "info",
    icon: "auto",
    position: "bottom",
    color: "white",
    backgroundColor: darkTheme.secondary,
    textStyle: { fontSize: 14 },
  });
};
