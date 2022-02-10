import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { darkTheme } from "../../utils/theme";
import { shimmerColors } from "../../utils/styles";
import { openURL } from "../../utils/link";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const ICON_SIZE = 22;

const Socials = ({ profile_loaded, socials }) => {
  const iconColor = darkTheme.on_surface_subtitle;

  return (
    <View style={styles.container}>
      {profile_loaded ? (
        <View>
          <View style={{ flexDirection: "row" }}>
            {typeof socials?.instagram === "string" && (
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() =>
                  openURL(`https://instagram.com/${socials.instagram}`)
                }
              >
                <Ionicons
                  name="logo-instagram"
                  size={ICON_SIZE}
                  color={iconColor}
                />
              </TouchableOpacity>
            )}
            {typeof socials?.twitch === "string" && (
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() => openURL(`https://twitch.tv/${socials.twitch}`)}
              >
                <Ionicons
                  name="logo-twitch"
                  size={ICON_SIZE}
                  color={iconColor}
                />
              </TouchableOpacity>
            )}

            {typeof socials?.youtube === "string" && (
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() =>
                  openURL(`https://youtube.com/channel/${socials.youtube}`)
                }
              >
                <Ionicons
                  name="logo-youtube"
                  size={ICON_SIZE}
                  color={iconColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <ShimmerPlaceHolder
          height={ICON_SIZE}
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
    marginVertical: 10,
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Socials;
