import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const videoIconSize = 20;

const VideoPlayer = ({
  videoRef,
  onViewedClip,
  VIDEO_HEIGHT,
  globalMute,
  globalToggleMute,
}) => {
  React.useEffect(() => {
    return () => {
      videoRef.current && videoRef.current.unloadAsync();
    };
  }, []);

  const toggleMute = async () => {
    const status = await videoRef.current.getStatusAsync();
    await videoRef.current.setIsMutedAsync(!status.isMuted);
    globalToggleMute();
  };

  return (
    <View style={[styles.container, { height: VIDEO_HEIGHT }]}>
      <Video
        ref={videoRef}
        style={[styles.video, { height: VIDEO_HEIGHT }]}
        resizeMode="contain"
        useNativeControls={false}
        onPlaybackStatusUpdate={async (status) => {
          if (status.error) {
            console.log(status);
          } else {
            if (status.didJustFinish) {
              onViewedClip();
              await videoRef.current.replayAsync();
            }
          }
        }}
      />
      <Ionicons
        name={globalMute ? "volume-mute" : "volume-high"}
        size={videoIconSize}
        style={[styles.icon, styles.mute]}
        color={darkTheme.on_surface_title}
        onPress={toggleMute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  video: { width: "100%" },
  icon: {
    borderRadius: videoIconSize / 2,
    backgroundColor: darkTheme.surface,
    zIndex: 1,
    padding: 5,
  },
  mute: { position: "absolute", bottom: 10, right: 10 },
});

export default VideoPlayer;
