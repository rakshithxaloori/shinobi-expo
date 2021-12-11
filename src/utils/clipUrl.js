export const clipUrlByNetSpeed = (templateUrl) => {
  let videoUri = templateUrl;
  // TODO decide based on internet speed
  videoUri = videoUri.replace("{}", "720");
  videoUri = videoUri.replace("{}", "8");
  return videoUri;
};
