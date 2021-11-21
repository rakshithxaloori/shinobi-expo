import { showMessage } from "react-native-flash-message";
import { darkTheme } from "./theme";

export const flashAlert = (
  message,
  description = "",
  big = false,
  duration = 1850
) => {
  showMessage({
    message: message,
    duration: duration,
    description: description,
    type: "info",
    icon: "auto",
    position: "bottom",
    color: "white",
    backgroundColor: darkTheme.secondary,
    textStyle: { fontSize: 14 },
  });
};
