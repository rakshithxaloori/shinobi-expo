import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

import Content from "./content";
import Cover from "./cover";

const Settings = (props) => {
  const closeSettings = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Cover />
      <TouchableOpacity style={styles.closeButton} onPress={closeSettings}>
        <IonIcons name="close-outline" size={44} />
      </TouchableOpacity>
      <Content />
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 191,
    left: "50%",
    marginLeft: -22,
    color: "#546bfb",
    backgroundColor: "white",
    borderRadius: 22,
    zIndex: 1,
    elevation: 15,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  container: {
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
});

export default Settings;
