import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { flashAlert } from "../../utils/flash_message";
import { darkTheme } from "../../utils/theme";

const SOCIALS_ICON_SIZE = 24;
const URL_SIZE = 18;

const FB_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

const Share = ({ post }) => {
  const openURL = (url) => {
    try {
      Linking.openURL(url);
    } catch (e) {
      flashAlert("Can't open link 😢");
    }
  };

  const shinobi_url = `https://shinobi.cc/clip/${post.id}`;
  const facebook_text = `A ${post.game.name} clip by ${post.posted_by.username} | Shinobi`;
  const reddit_title = post.title;
  const reddit_text = `${post.posted_by.username} | Shinobi\n${shinobi_url}`;
  const twitter_text = `${post.title}\nA ${post.game.name} clip by ${post.posted_by.username} | Shinobi\n${shinobi_url}`;

  return (
    <View style={styles.container}>
      <Text style={styles.url}>{shinobi_url}</Text>
      <View style={{ flexDirection: "row", margin: 10 }}>
        <Ionicons
          name="logo-facebook"
          onPress={() => {
            openURL(
              `https://www.facebook.com/sharer/sharer.php?app_id=${FB_APP_ID}&u=${encodeURI(
                shinobi_url
              )}&quote=${encodeURI(facebook_text)}`
            );
          }}
          style={styles.icon}
          color="#4267B2"
          size={SOCIALS_ICON_SIZE}
        />
        <Ionicons
          name="logo-reddit"
          onPress={() => {
            openURL(
              `https://reddit.com/submit?title=${encodeURI(
                reddit_title
              )}&text=${encodeURI(reddit_text)}`
            );
          }}
          style={styles.icon}
          color="#FF5700"
          size={SOCIALS_ICON_SIZE}
        />
        <Ionicons
          name="logo-twitter"
          onPress={() => {
            openURL(
              `https://twitter.com/intent/tweet?text=${encodeURI(twitter_text)}`
            );
          }}
          style={styles.icon}
          color="#1DA1F2"
          size={SOCIALS_ICON_SIZE}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  url: { color: darkTheme.on_background, fontSize: URL_SIZE - 3 },
  icon: { marginRight: 8, marginLeft: 8 },
  container: { justifyContent: "center", alignItems: "center" },
});

export default Share;
