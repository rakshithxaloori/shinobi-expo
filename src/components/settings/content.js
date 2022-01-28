import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { darkTheme } from "../../utils/theme";
import ShnSocials from "../socials";
import AuthContext from "../../authContext";

const Setting = ({ onPress, iconName, title, subtitle }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Ionicons
      name={iconName}
      style={styles.icon}
      size={32}
      color={darkTheme.on_background}
    />
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const Content = () => {
  const navigation = useNavigation();
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Setting
        onPress={() => {
          navigation.navigate("Games");
        }}
        iconName="game-controller"
        title="Games I play"
        subtitle="Shows the games you play on your profile"
      />
      <Setting
        onPress={() => {
          navigation.navigate("Connect Socials");
        }}
        iconName="earth-outline"
        title="Connect Socials"
        subtitle="📺 Let others know where else you are on"
      />
      <Setting
        onPress={() => {
          navigation.navigate("Privacy Settings");
        }}
        iconName="lock-open"
        title="Privacy Settings"
        subtitle="🤫 Things that must remain secret"
      />
      <Setting
        onPress={() => {
          navigation.navigate("Terms");
        }}
        iconName="document-text"
        title="Terms and Conditions"
        subtitle="🙀 In case, you want to read it!"
      />
      <Setting
        onPress={() => {
          navigation.navigate("Privacy Policy");
        }}
        iconName="file-tray-full"
        title="Privacy Policy"
        subtitle="👽 Hold on, are you bored?!"
      />
      <Setting
        onPress={() => {
          Linking.openURL("mailto:hello@shinobi.cc");
        }}
        iconName="mail"
        title="Contact Us"
        subtitle="👀 Here, whenever you need"
      />
      <Setting
        onPress={signOut}
        iconName="log-out-outline"
        title="Log out"
        subtitle="👋 Hasta la vista, baby!"
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: darkTheme.on_surface_subtitle,
            width: "80%",
            height: 4,
            borderRadius: 2,
            marginVertical: 20,
          }}
        />
        <ShnSocials />
        <Text style={styles.helpText}>
          Join us on our subreddit or discord server.
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Text style={styles.madeby}>💥 </Text>
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
