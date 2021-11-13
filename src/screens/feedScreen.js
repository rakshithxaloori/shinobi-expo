import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import IonIcons from "react-native-vector-icons/Ionicons";

import AuthContext from "../authContext";
import { avatarDefaultStyling } from "../utils/styles";
import { darkTheme } from "../utils/theme";
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
            props.navigation.navigate("Profile");
          }}
        />
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.name}>{user?.username}</Text>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Search");
            }}
            style={{ marginRight: 10 }}
          >
            <IonIcons name="search-sharp" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Settings");
            }}
          >
            <IonIcons name="settings" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Feed</Text>
      <MatchList navigation={props.navigation} />
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
