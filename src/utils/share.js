import React from "react";
import { Share, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { flashAlert } from "./flash_message";
import { darkTheme } from "./theme";
import { createAPIKit } from "./APIKit";
import { handleAPIError } from ".";

export const DEEP_LINK_TYPES = {
  PROFILE: "p",
  CLIP: "c",
  FOLLOW: "f",
  LIKE: "l",
  TAG: "t",
  REPOST: "rp",
};

export const getDeepLink = (type, params) => {
  console.log(type, params);
  const baseURL = "https://www.shinobi.cc/";
  const username = params?.username;
  const post_id = params?.post_id;
  switch (type) {
    case DEEP_LINK_TYPES.PROFILE:
      return baseURL + `profile/${username}`;

    case DEEP_LINK_TYPES.CLIP:
      return baseURL + `clip/${post_id}`;

    case DEEP_LINK_TYPES.FOLLOW:
      return baseURL + "notifications";

    case DEEP_LINK_TYPES.LIKE:
      return baseURL + "notifications";

    case DEEP_LINK_TYPES.TAG:
      return baseURL + `clip/${post_id}`;

    case DEEP_LINK_TYPES.REPOST:
      return baseURL + "notifications";

    default:
      return null;
  }
};

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

export const PLAY_STORE_LINK =
  "https://play.google.com/store/apps/details?id=cc.shinobi.android";

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
  const deepLinkURL = getDeepLink(DEEP_LINK_TYPES.PROFILE, { username });
  const message = `${username}'s a Shinobi profile\n${deepLinkURL}`;
  await _handleShare(message);
};

export const shareApp = async () => {
  const message = `Share gaming clips with me on Shinobi App!\n${PLAY_STORE_LINK}`;
  await _handleShare(message);
};

export const shareClip = async (post_id, title, username, game_name) => {
  const deepLinkURL = getDeepLink(DEEP_LINK_TYPES.CLIP, { post_id });
  const message = `"${title}", ${game_name} clip by ${username}\n${deepLinkURL}`;
  await _handleShare(message, "/feed/post/share/", { post_id });
};
