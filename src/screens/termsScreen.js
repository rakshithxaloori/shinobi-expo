import React from "react";
import { WebView } from "react-native-webview";

const TermsScreen = () => {
  return (
    <WebView
      style={{ flex: 1 }}
      source={{ uri: "https://www.shinobi.cc/legal/terms" }}
    />
  );
};

export default TermsScreen;
