import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

import AuthContext from "../authContext";
import { avatarDefaultStyling } from "../utils/styles";
import { darkTheme } from "../utils/theme";
import ClipsFeed from "../components/clips";
import MatchList from "../components/feed/matchList";
import VirtualizedList from "../utils/virtualizedList";

const Feed = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <VirtualizedList style={styles.container}>
      <View style={styles.titleBar}>
        <Avatar
          rounded
          size={55}
          title={user?.username[0]}
          source={{ uri: user?.picture }}
          containerStyle={[styles.avatar, avatarDefaultStyling]}
          onPress={() => {
            const resetAction = CommonActions.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "Profile" }],
            });
            props.navigation.dispatch(resetAction);
          }}
          ImageComponent={FastImage}
        />
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.name}>{user?.username}</Text>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }, { name: "Upload" }],
              });

              props.navigation.dispatch(resetAction);
            }}
            style={{ marginRight: 10 }}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={darkTheme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }, { name: "Search" }],
              });

              props.navigation.dispatch(resetAction);
            }}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="search-sharp" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }, { name: "Settings" }],
              });

              props.navigation.dispatch(resetAction);
            }}
          >
            <Ionicons name="settings" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Feed</Text>
      {/* <MatchList navigation={props.navigation} /> */}
      <View style={{ width: "100%", paddingHorizontal: 10 }}>
        <ClipsFeed navigation={props.navigation} type="Feed" />
      </View>
    </VirtualizedList>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginLeft: 20,
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 16,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  name: {
    fontSize: 20,
    color: darkTheme.on_background,
    fontWeight: "bold",
  },
  options: {
    flexDirection: "row",
    position: "absolute",
    right: 20,
    top: 5,
  },
  titleBar: {
    width: "100%",
    marginTop: 50,
    paddingLeft: 90,
  },

  header: {
    color: darkTheme.on_background,
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 50,
    textTransform: "uppercase",
  },

  container: {
    height: "100%",
    width: "100%",
  },
});

export default Feed;
