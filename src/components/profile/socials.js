import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const iconSize = 30;

const Socials = ({
  profile_loaded,
  instagram_username,
  twitch_profile,
  youtube_channel_id,
}) => {
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
              <Ionicons name="logo-instagram" size={iconSize} />
            </TouchableOpacity>
          )}
          {twitch_profile &&
            (twitch_profile?.stream ? (
              // Blinking icon
              // Object {
              //   "login": "uchiha_leo_06",
              //   "stream": Object {
              //     "game": Object {
              //       "logo_url": "https://static-cdn.jtvnw.net/ttv-boxart/Just%20Chatting-{width}x{height}.jpg",
              //       "name": "Just Chatting",
              //     },
              //     "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_uchiha_leo_06-{width}x{height}.jpg",
              //     "title": "Test 4",
              //   },
              // }

              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() =>
                  linkURL(`https://twitch.tv/${twitch_profile?.login}`)
                }
              >
                <Ionicons name="logo-twitch" size={iconSize} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() =>
                  linkURL(`https://twitch.tv/${twitch_profile?.login}`)
                }
              >
                <Ionicons name="logo-twitch" size={iconSize} />
              </TouchableOpacity>
            ))}
          {youtube_channel_id && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                linkURL(`https://youtube.com/channel/${youtube_channel_id}`)
              }
            >
              <Ionicons name="logo-youtube" size={iconSize} />
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
    flexDirection: "row",
    paddingTop: 5,
    alignItems: "center",
  },
});

export default Socials;
