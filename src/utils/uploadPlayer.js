import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const videoIconSize = 20;
const screenHeight = Dimensions.get("screen").width;

const VideoPlayer = ({ videoUri, videoHeight }) => {
  const videoRef = React.useRef();
  const [play, setPlay] = React.useState(true);
  const [mute, setMute] = React.useState(true);

  React.useEffect(() => {
    const loadVideo = async () => {
      await videoRef.current.loadAsync(
        { uri: videoUri },
        {
          shouldPlay: true,
          isMuted: true,
          isLooping: true,
        }
      );
    };
    loadVideo();

    return () => {
      videoRef.current && videoRef.current.unloadAsync();
    };
  }, [videoRef.current]);

  const toggleMute = async () => {
    const status = await videoRef.current.getStatusAsync();
    await videoRef.current.setIsMutedAsync(!status.isMuted);
    setMute(!status.isMuted);
  };

  const togglePlay = async () => {
    const status = await videoRef.current.getStatusAsync();
    if (status.isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
    setPlay(!status.isPlaying);
  };

  return (
    <View
      style={[
        styles.container,
        { height: Math.min((3 * screenHeight) / 4, videoHeight) },
      ]}
    >
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode="contain"
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.error) {
            console.log(status);
          }
        }}
      />
      <Ionicons
        name={mute ? "volume-mute" : "volume-high"}
        size={videoIconSize}
        style={[styles.icon, styles.mute]}
        color={darkTheme.on_surface_title}
        onPress={toggleMute}
      />
      <Ionicons
        name={play ? "play" : "pause"}
        size={videoIconSize}
        style={[styles.icon, styles.play]}
        color={darkTheme.on_surface_title}
        onPress={togglePlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  video: { height: "100%", width: "100%" },
  icon: {
    borderRadius: videoIconSize / 2,
    backgroundColor: darkTheme.surface,
    zIndex: 1,
    padding: 5,
  },
  mute: { position: "absolute", bottom: 10, right: 10 },
  play: { position: "absolute", bottom: 10, left: 10 },
});

export default VideoPlayer;
