import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "./theme";

const videoIconSize = 20;
const statsIconSize = 20;

const VideoPlayer = ({
  videoUri,
  VIDEO_HEIGHT = null,
  videoStyle = {},
  stats = null,
}) => {
  const [mute, setMute] = React.useState(true);
  const [play, setPlay] = React.useState(false);
  const videoRef = React.useRef(null);

  const toggleLike = () => {};
  const shareClip = () => {};

  React.useEffect(() => {
    videoRef.current.loadAsync(
      { uri: videoUri },
      {
        shouldPlay: play,
        isLooping: true,
        isMuted: mute,
      }
    );
    return () => {
      videoRef.current.unloadAsync();
    };
  }, []);

  const togglePlay = async () => {
    const status = await videoRef.current.getStatusAsync();
    if (status.isPlaying) {
      videoRef.current.pauseAsync();
      setPlay(false);
    } else {
      videoRef.current.playAsync();
      setPlay(true);
    }
  };

  const toggleMute = async () => {
    const status = await videoRef.current.getStatusAsync();
    if (status.isMuted) {
      videoRef.current.setIsMutedAsync(false);
      setMute(false);
    } else {
      videoRef.current.setIsMutedAsync(true);
      setMute(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          height: VIDEO_HEIGHT || videoStyle.height,
        },
      ]}
    >
      <Video
        ref={videoRef}
        style={[
          {
            height: VIDEO_HEIGHT,
            width: "100%",
          },
          videoStyle,
        ]}
        resizeMode="contain"
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.error) {
            setPlay(false);
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
        name={play ? "pause" : "play"}
        size={videoIconSize}
        style={[styles.icon, styles.play]}
        color={darkTheme.on_surface_title}
        onPress={togglePlay}
      />
      {stats && (
        <View>
          <Ionicons name={"heart"} onPress={toggleLike} />
          <Ionicons name={"share-social"} onPress={shareClip} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  stats: {},
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
