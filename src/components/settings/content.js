import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import LogOut from "./logout";
import { darkTheme } from "../../utils/theme";
import ShnSocials from "../socials";

const Content = () => {
  const navigation = useNavigation();

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
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Connect Socials");
        }}
      >
        <Ionicons
          name="earth-outline"
          style={styles.icon}
          size={32}
          color={darkTheme.on_background}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Connect Socials</Text>
          <Text style={styles.text}>
            Let others know where else you are on 📺
          </Text>
        </View>
      </TouchableOpacity>
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
          <Text style={styles.text}>In case, you want to read it! 🙀</Text>
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
          <Text style={styles.text}>Wait, are you bored?! 👽</Text>
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
          <Text style={styles.text}>Here, whenever you need 👀</Text>
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
        <ShnSocials />
        <Text style={styles.helpText}>
          Join us on our subreddit or discord server.
        </Text>
        <Text style={styles.helpText}>
          Tell your friends about Shinobi! Click the Play Store icon to share.
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Text style={styles.madeby}>Made by </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", { username: "leo_uchiha" });
            }}
          >
            <Text style={[styles.madeby, { textDecorationLine: "underline" }]}>
              rakshith.aloori
            </Text>
          </TouchableOpacity>
          <Text style={styles.madeby}>💥</Text>
        </View>
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
  madeby: { color: darkTheme.on_surface_title, fontSize: 12, paddingTop: 10 },
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
