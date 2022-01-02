import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const ICON_SIZE = 20;
const POSTER_SIZE = 88;

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
        usePoster
        posterSource={{
          uri: Asset.fromModule(require("../../assets/notification-icon.png"))
            .uri,
        }}
        posterStyle={[
          styles.poster,
          { marginTop: (VIDEO_HEIGHT - POSTER_SIZE) / 2 },
        ]}
        style={{ height: VIDEO_HEIGHT }}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
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
        size={ICON_SIZE}
        style={[styles.icon, styles.mute]}
        color={darkTheme.on_surface_title}
        onPress={toggleMute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  poster: {
    height: POSTER_SIZE,
    alignSelf: "center",
  },
  icon: {
    borderRadius: ICON_SIZE / 2,
    backgroundColor: darkTheme.surface,
    zIndex: 1,
    padding: 5,
  },
  mute: { position: "absolute", bottom: 10, right: 10 },
});

export default VideoPlayer;
