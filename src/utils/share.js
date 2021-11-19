import React from "react";
import { Share, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { flashAlert } from "./flash_message";
import { darkTheme } from "./theme";

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
  const message = `Here's a Shinobi profile https://www.shinobi.cc/s?username=${username}`;
  await _handleShare(message);
};

export const shareLolMatch = async (match_id) => {
  const message = `Here's a League of Legends' match https://www.shinobi.cc/lol?match_id=${match_id}`;
  await _handleShare(message);
};

export const shareApp = async () => {
  const message = `Track your League matches and champion masteries https://play.google.com/store/apps/details?id=cc.shinobi.android`;
  await _handleShare(message);
};
