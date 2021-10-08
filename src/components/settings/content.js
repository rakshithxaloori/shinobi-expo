import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Linking from "expo-linking";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import SocialsSettings from "./socials";
import LogOut from "./logout";
import { darkTheme } from "../../utils/theme";

const Content = () => {
  const linkURL = async (URL) => {
    try {
      Linking.openURL(URL);
    } catch (error) {
      console.log(error);
    }
  };

  const [socialsLoaded, setSocialsLoaded] = React.useState(false);

  const placeholder = () => (
    <>
      <ShimmerPlaceHolder
        height={20}
        width={250}
        shimmerStyle={styles.placeholder}
      />
      <ShimmerPlaceHolder
        height={10}
        width={100}
        shimmerStyle={styles.placeholder}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <SocialsSettings setSocialsLoaded={setSocialsLoaded} />
      {socialsLoaded ? <LogOut /> : placeholder()}
      <View
        style={{
          alignSelf: "flex-end",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Ionicons
            name="logo-reddit"
            size={33}
            color={darkTheme.on_surface_title}
          />
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Post on the subreddit to report bugs or request new features.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 6,
    backgroundColor: darkTheme.background,
    padding: 50,
  },
});

export default Content;
