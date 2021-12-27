import React from "react";
import { WebView } from "react-native-webview";

const PolicyScreen = () => {
  return (
    <WebView
      style={{ flex: 1 }}
      source={{ uri: "https://www.shinobi.cc/legal/privacy-policy" }}
    />
  );
};

export default PolicyScreen;
