export const clipUrlByNetSpeed = (templateUrl) => {
  let videoUri = templateUrl;
  // TODO decide based on internet speed
  videoUri = videoUri.replace("{}", "2");
  return videoUri;
};
