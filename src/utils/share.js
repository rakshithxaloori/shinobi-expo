import { Share } from "react-native";

import { flashAlert } from "./flash_message";

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
  const message = `Here's a Shinobi profile https://www.shinobi.cc/profile?username=${username}`;
  await _handleShare(message);
};

export const shareLolMatch = async (match_id) => {
  const message = `Here's a League of Legends' match https://www.shinobi.cc/lol?match_id=${match_id}`;
  await _handleShare(message);
};
