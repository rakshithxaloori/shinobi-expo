import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import SocialsSettings from "./socials";
import LogOut from "./logout";
import { darkTheme } from "../../utils/theme";
import { flashAlert } from "../../utils/flash_message";

const Content = () => {
  const linkURL = async (URL) => {
    try {
      Linking.openURL(URL);
    } catch (error) {
      console.log(error);
    }
  };

  const [socialsLoaded, setSocialsLoaded] = React.useState(false);

  const placeholder = () => (
    <>
      <ShimmerPlaceHolder
        height={20}
        width={250}
        shimmerStyle={styles.placeholder}
      />
      <ShimmerPlaceHolder
        height={10}
        width={100}
        shimmerStyle={styles.placeholder}
      />
    </>
  );

  const openSubReddit = () => {
    linkURL("https://www.reddit.com/r/shinobi_app");
  };

  const copyAppLink = () => {
    Clipboard.setString(
      "https://play.google.com/store/apps/details?id=cc.shinobi.android"
    );
    flashAlert("Play Store link copied!");
  };

  return (
    <View style={styles.container}>
      <SocialsSettings setSocialsLoaded={setSocialsLoaded} />
      {socialsLoaded ? <LogOut /> : placeholder()}
      <View
        style={{
          alignSelf: "flex-end",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", paddingRight: 10 }}
            onPress={openSubReddit}
          >
            <Ionicons
              name="logo-reddit"
              size={33}
              color={darkTheme.on_surface_title}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", paddingLeft: 10 }}
            onPress={copyAppLink}
          >
            <Ionicons
              name="share-social-sharp"
              size={33}
              color={darkTheme.on_surface_title}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.helpText}>
          Post on the subreddit to report bugs or request new features.
        </Text>
        <Text style={styles.helpText}>
          Share the app with your friends! Click the share icon to the copy app
          link.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  helpText: {
    color: darkTheme.on_surface_title,
    fontSize: 12,
    paddingTop: 10,
  },
  placeholder: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
    borderRadius: 10,
  },
  container: {
    flex: 6,
    backgroundColor: darkTheme.background,
    padding: 50,
  },
});

export default Content;