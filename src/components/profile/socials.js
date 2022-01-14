import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { darkTheme } from "../../utils/theme";
import { shimmerColors } from "../../utils/styles";
import { openURL } from "../../utils/link";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Socials = ({ profile_loaded, socials }) => {
  const iconSize = 22;
  const iconColor = darkTheme.on_surface_subtitle;

  return (
    <View style={styles.container}>
      {profile_loaded ? (
        <View style={{ flexDirection: "row" }}>
          {socials?.instagram && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                openURL(`https://instagram.com/${socials.instagram}`)
              }
            >
              <Ionicons
                name="logo-instagram"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
          {socials?.twitch && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => openURL(`https://twitch.tv/${socials.twitch}`)}
            >
              <Ionicons name="logo-twitch" size={iconSize} color={iconColor} />
            </TouchableOpacity>
          )}

          {socials?.youtube && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                openURL(`https://youtube.com/channel/${socials.youtube}`)
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
    marginHorizontal: 3,
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
