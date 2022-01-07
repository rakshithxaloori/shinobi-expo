import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import SocialsSettings from "./socials";
import LogOut from "./logout";
import { darkTheme } from "../../utils/theme";
import { shareApp } from "../../utils/share";
import { shimmerColors } from "../../utils/styles";

const Content = () => {
  const navigation = useNavigation();
  const linkURL = async (URL) => {
    try {
      Linking.openURL(URL);
    } catch (error) {
      console.log(error);
    }
  };

  const [socialsLoaded, setSocialsLoaded] = React.useState(false);

  const openSubReddit = () => {
    linkURL("https://www.reddit.com/r/ShinobiApp/");
  };

  const openDiscord = () => {
    linkURL(process.env.DISCORD_INVITE_LINK);
  };

  const shareAppLink = () => {
    shareApp();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Games");
        }}
      >
        <Ionicons
          name="game-controller"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Change games I play</Text>
          <Text style={styles.text}>
            Shows the games you play on your profile
          </Text>
        </View>
      </TouchableOpacity>
      <SocialsSettings setSocialsLoaded={setSocialsLoaded} />
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Terms");
        }}
      >
        <Ionicons
          name="document-text"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.text}>In case, you want to read it!</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Privacy Policy");
        }}
      >
        <Ionicons
          name="file-tray-full"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.text}>Wait, are you bored?</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          Linking.openURL("mailto:hello@shinobi.cc");
        }}
      >
        <Ionicons
          name="mail"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.text}>Here, whenever you need</Text>
        </View>
      </TouchableOpacity>
      <LogOut />
      <View
        style={{
          alignSelf: "flex-end",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity style={styles.socialIcon} onPress={openSubReddit}>
            <Ionicons
              name="logo-reddit"
              size={33}
              color={darkTheme.on_surface_title}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} onPress={openDiscord}>
            <MaterialCommunityIcons
              name="discord"
              size={33}
              color={darkTheme.on_surface_title}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} onPress={shareAppLink}>
            <Ionicons
              name="share-social-sharp"
              size={33}
              color={darkTheme.on_surface_title}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.helpText}>
          Post on our subreddit or discord server to report bugs or request new
          features.
        </Text>
        <Text style={styles.helpText}>
          Tell your friends about Shinobi! Click the share icon to share.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: darkTheme.on_surface_title,
    fontSize: 24,
    fontWeight: "600",
  },
  text: {
    color: darkTheme.on_surface_title,
    fontWeight: "600",
    opacity: 0.6,
    marginTop: 5,
  },
  content: {
    paddingLeft: 20,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
  },
  helpText: {
    color: darkTheme.on_surface_title,
    fontSize: 12,
    paddingTop: 10,
  },
  placeholder: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
    borderRadius: 10,
  },
  socialIcon: { alignItems: "center", paddingHorizontal: 10 },
  container: {
    flex: 6,
    backgroundColor: darkTheme.background,
    padding: 50,
  },
});

export default Content;
