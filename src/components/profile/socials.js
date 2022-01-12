import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { darkTheme } from "../../utils/theme";
import { flashAlert } from "../../utils/flash_message";
import { shimmerColors } from "../../utils/styles";
import { openURL } from "../../utils/link";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Socials = ({
  profile_loaded,
  instagram_username,
  twitch_profile,
  youtube_channel_id,
}) => {
  const iconSize = 22;
  const iconColor = darkTheme.on_surface_subtitle;

  return (
    <View style={styles.container}>
      {profile_loaded ? (
        <View style={{ flexDirection: "row" }}>
          {instagram_username && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                openURL(`https://instagram.com/${instagram_username}`)
              }
            >
              <Ionicons
                name="logo-instagram"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
          {twitch_profile && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                openURL(`https://twitch.tv/${twitch_profile?.login}`)
              }
            >
              <Ionicons name="logo-twitch" size={iconSize} color={iconColor} />
            </TouchableOpacity>
          )}

          {youtube_channel_id && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                openURL(`https://youtube.com/channel/${youtube_channel_id}`)
              }
            >
              <Ionicons name="logo-youtube" size={iconSize} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ShimmerPlaceHolder
          height={iconSize}
          width={80}
          shimmerStyle={{ borderRadius: 10 }}
          shimmerColors={shimmerColors}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  socialIcon: {
    // marginRight: 10,
  },
  container: {
    position: "absolute",
    top: 100,
    left: 10,
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Socials;
