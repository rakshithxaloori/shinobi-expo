import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const clipUrlByNetSpeed = (templateUrl) => {
  let videoUri = templateUrl;
  // TODO decide based on internet speed
  videoUri = videoUri.replace("{}", "3");
  return videoUri;
};

export const getVideoHeight = (video_height, video_width) => {
  const min_height = Math.min(
    (video_height * screenWidth) / video_width,
    0.6 * screenHeight,
    450
  );
  return min_height;
};
