import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const getVideoHeight = (hToWRatio) => {
  // Return min
  const SCREEN_DIMENSIONS = Dimensions.get("screen");
  return Math.min(
    SCREEN_DIMENSIONS.width * hToWRatio,
    0.7 * SCREEN_DIMENSIONS.height
  );
};

const ICON_SIZE = 20;
const POSTER_SIZE = 88;
const SCREEN_WIDTH = Dimensions.get("screen").width;

const VideoPlayer = ({
  videoRef,
  onViewedClip,
  hToWRatio,
  globalPlay,
  globalTogglePlay,
  globalMute,
  globalToggleMute,
}) => {
  const VIDEO_HEIGHT = getVideoHeight(hToWRatio || 9 / 16);
  const PLAY_PAUSE_SIZE = (VIDEO_HEIGHT * 6) / 10;

  const toggleMute = async () => {
    const status = await videoRef.current.getStatusAsync();
    await videoRef.current.setIsMutedAsync(!status.isMuted);
    globalToggleMute();
  };

  const togglePlay = async () => {
    const status = await videoRef.current.getStatusAsync();
    status.isPlaying
      ? await videoRef.current.pauseAsync()
      : await videoRef.current.playAsync();
    globalTogglePlay();
  };

  const playPauseStyle = {
    top: (VIDEO_HEIGHT * 2) / 10,
    height: PLAY_PAUSE_SIZE,
    width: PLAY_PAUSE_SIZE,
  };

  return (
    <View style={[styles.container, { height: VIDEO_HEIGHT }]}>
      <Video
        ref={videoRef}
        usePoster={globalPlay}
        posterSource={require("../../assets/notification-icon.png")}
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
      <TouchableOpacity
        style={[styles.play_pause, playPauseStyle]}
        onPress={togglePlay}
      >
        {globalPlay === false && (
          <Ionicons
            name="play"
            size={SCREEN_WIDTH / 4}
            color={darkTheme.on_surface_title}
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      <Ionicons
        name={globalMute ? "volume-mute" : "volume-high"}
        size={ICON_SIZE}
        style={[styles.icon, styles.mute, styles.smallIcon]}
        color={darkTheme.on_surface_title}
        onPress={toggleMute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  poster: {
    height: POSTER_SIZE,
    width: "100%",
    alignSelf: "center",
  },
  icon: {
    borderRadius: ICON_SIZE / 2,

    zIndex: 1,
    padding: 5,
  },
  smallIcon: { backgroundColor: darkTheme.surface },
  play_pause: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  mute: { position: "absolute", bottom: 10, right: 10 },
});

export default VideoPlayer;
