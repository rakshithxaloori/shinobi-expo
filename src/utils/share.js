import React from "react";
import { Share, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { flashAlert } from "./flash_message";
import { darkTheme } from "./theme";
import { createAPIKit } from "./APIKit";
import { handleAPIError } from ".";

export const ShareIcon = ({ onPress }) => (
  <Ionicons
    name="share-social"
    size={28}
    color={darkTheme.on_background}
    onPress={onPress}
    style={styles.shareHeader}
  />
);

const styles = StyleSheet.create({ shareHeader: { marginRight: 16 } });

const _handleShare = async (message, urlPath = null, postData = null) => {
  try {
    const result = await Share.share({
      message,
    });
    if (result.action === Share.sharedAction) {
      if (urlPath !== null) {
        const APIKit = await createAPIKit();
        try {
          await APIKit.post(urlPath, postData);
        } catch (e) {
          flashAlert(handleAPIError(e));
        }
      }
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    flashAlert(error.message);
  }
};

export const shareProfile = async (username) => {
  const message = `${username}'s a Shinobi profile https://www.shinobi.cc/s?u=${username}`;
  await _handleShare(message);
};

export const shareMatch = async (match) => {
  // TODO generalised
  // Here's a {game_name} match https://www.shinobi.cc/match/?g={game_code}&m={match_id}
};

export const shareApp = async () => {
  const message = `Upload a game clip! Shinobi app on Play Store https://play.google.com/store/apps/details?id=cc.shinobi.android`;
  await _handleShare(message);
};

export const shareClip = async (post_id, username, game_name) => {
  const message = `${game_name} clip by ${username} https://www.shinobi.cc/clip?c=${post_id}`;
  await _handleShare(message, "/feed/post/share/", { post_id });
};
