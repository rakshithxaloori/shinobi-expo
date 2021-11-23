import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const iconSize = 20;

const VideoPlayer = ({ videoUri, VIDEO_HEIGHT = null, videoStyle = {} }) => {
  const [mute, setMute] = React.useState(true);
  const [play, setPlay] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          height: VIDEO_HEIGHT || videoStyle.height,
        },
      ]}
    >
      <Ionicons
        name={mute ? "volume-mute" : "volume-high"}
        size={iconSize}
        style={[styles.icon, styles.mute]}
        color={darkTheme.on_surface_title}
        onPress={() => {
          setMute(!mute);
        }}
      />
      <Ionicons
        name={play ? "pause" : "play"}
        size={iconSize}
        style={[styles.icon, styles.play]}
        color={darkTheme.on_surface_title}
        onPress={() => {
          setPlay(!play);
        }}
      />
      <Video
        style={[
          {
            height: VIDEO_HEIGHT,
            width: "100%",
          },
          videoStyle,
        ]}
        source={{ uri: videoUri }}
        resizeMode="contain"
        shouldPlay={play}
        isLooping={true}
        isMuted={mute}
        onPlaybackStatusUpdate={(status) => {
          if (status.error) {
            setPlay(false);
            console.log(status);
          }
        }}
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
  icon: {
    borderRadius: iconSize / 2,
    backgroundColor: darkTheme.surface,
    zIndex: 1,
    padding: 5,
  },
  mute: { position: "absolute", bottom: 10, right: 10 },
  play: { position: "absolute", bottom: 10, left: 10 },
});

export default VideoPlayer;
