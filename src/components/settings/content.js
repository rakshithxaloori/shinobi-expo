import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import SocialsSettings from "./socials";
import LogOut from "./logout";

const Content = () => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
    borderRadius: 10,
  },
  container: {
    height: Dimensions.get("window").height - 142,
    backgroundColor: "#f0f3f5",
    padding: 50,
  },
});

export default Content;
