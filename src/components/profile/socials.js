import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { darkTheme } from "../../utils/theme";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Socials = ({
  profile_loaded,
  instagram_username,
  twitch_profile,
  youtube_channel_id,
}) => {
  const iconSize = 22;
  const iconColor = darkTheme.on_surface_subtitle;
  const linkURL = async (URL) => {
    try {
      Linking.openURL(URL);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {profile_loaded ? (
        <View style={{ flexDirection: "row" }}>
          {instagram_username && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                linkURL(`https://instagram.com/${instagram_username}`)
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
                linkURL(`https://twitch.tv/${twitch_profile?.login}`)
              }
            >
              <Ionicons name="logo-twitch" size={iconSize} color={iconColor} />
            </TouchableOpacity>
          )}

          {youtube_channel_id && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                linkURL(`https://youtube.com/channel/${youtube_channel_id}`)
              }
            >
              <Ionicons name="logo-youtube" size={iconSize} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ShimmerPlaceHolder
          height={iconSize}
          width={130}
          shimmerStyle={{ borderRadius: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  socialIcon: {
    marginRight: 10,
  },
  container: {
    position: "absolute",
    top: 100,
    left: 10,
    flexDirection: "row",
    paddingTop: 5,
    alignItems: "center",
  },
});

export default Socials;
