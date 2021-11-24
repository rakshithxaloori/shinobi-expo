import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const videoIconSize = 20;

const VideoPlayer = ({
  videoRef,
  VIDEO_HEIGHT,
  globalMute,
  globalToggleMute,
}) => {
  React.useEffect(() => {
    return () => {
      console.log("UNLOADING VIDEO");
      try {
        if (videoRef.current !== null) videoRef.current.unloadAsync();
      } catch (e) {}
    };
  }, []);

  const toggleMute = async () => {
    globalToggleMute();
  };

  return (
    <View style={[styles.container, { height: VIDEO_HEIGHT }]}>
      <Video
        ref={videoRef}
        style={[styles.video, { height: VIDEO_HEIGHT }]}
        resizeMode="contain"
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.error) {
            console.log(status);
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