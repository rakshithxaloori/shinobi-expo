import React from "react";
import { Share, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { flashAlert } from "./flash_message";
import { darkTheme } from "./theme";
import { createAPIKit } from "./APIKit";

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

const _handleShare = async (message) => {
  try {
    const result = await Share.share({
      message,
    });
    if (result.action === Share.sharedAction) {
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
  const message = `${username}'s a Shinobi profile https://www.shinobi.cc/s?username=${username}`;
  await _handleShare(message);
};

export const shareLolMatch = async (match_id) => {
  const message = `Here's a League of Legends' match https://www.shinobi.cc/lol?match_id=${match_id}`;
  await _handleShare(message);
};

export const shareApp = async () => {
  const message = `Upload a game clip! Shinobi app on Play Store https://play.google.com/store/apps/details?id=cc.shinobi.android`;
  await _handleShare(message);
};

export const shareClip = async (clip_id, username, game_name) => {
  const APIKit = await createAPIKit();
  try {
    await APIKit.post("/clips/share/", { clip_id });
  } catch (e) {
    console.log(e);
  }
  const message = `${game_name} clip by ${username} https://www.shinobi.cc/c?clip_id=${clip_id}`;
  await _handleShare(message);
};
