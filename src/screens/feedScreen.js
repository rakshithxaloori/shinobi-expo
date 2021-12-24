import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import axios from "axios";

import AuthContext from "../authContext";
import { avatarDefaultStyling } from "../utils/styles";
import { darkTheme } from "../utils/theme";
import PostsFeed from "../components/posts";
import MatchList from "../components/feed/matchList";
import VirtualizedList from "../utils/virtualizedList";
import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { handleAPIError } from "../utils";
import UpdatesOverlay from "../components/feed/updatesOverlay";

const FeedScreen = (props) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [isVisible, setIsVisible] = React.useState(false);
  const [updates, setUpdates] = React.useState([]);

  React.useEffect(() => {
    const checkAppUpdate = async () => {
      const fetchUpdates = async () => {
        const onSuccess = async (response) => {
          const { updates } = response.data?.payload?.updates;
          setUpdates(updates);
          setIsVisible(true);
          await SecureStore.setItemAsync("update", Constants.manifest.version);
        };

        const APIKit = await createAPIKit();
        APIKit.post(
          "ux/updates/",
          { version: Constants.manifest.version },
          { cancelToken: cancelTokenSource.token }
        )
          .then(onSuccess)
          .catch((e) => {
            flashAlert(handleAPIError(e));
          });
      };

      try {
        const updateVersion = await SecureStore.getItemAsync("update");
        if (
          updateVersion === undefined ||
          updateVersion === null ||
          updateVersion !== Constants.manifest.version
        ) {
          // Fetch updates
          await fetchUpdates();
        }
      } catch (e) {
        // Fetch updates
        await fetchUpdates();
      }
    };
    checkAppUpdate();
  }, []);

  const { navigation } = props;

  const { user } = useContext(AuthContext);

  const navigateUpload = () => {
    navigation.navigate("Upload");
  };

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateSearch = () => {
    navigation.navigate("Search");
  };

  const navigateSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <VirtualizedList style={styles.container}>
      <View style={styles.titleBar}>
        <Avatar
          rounded
          size={55}
          title={user?.username[0]}
          source={{ uri: user?.picture }}
          containerStyle={[styles.avatar, avatarDefaultStyling]}
          onPress={navigateProfile}
          ImageComponent={FastImage}
        />
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.name}>{user?.username}</Text>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={navigateUpload}
            style={{ marginRight: 10 }}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={darkTheme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateSearch}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="search-sharp" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateSettings}>
            <Ionicons name="settings" size={32} color={darkTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Feed</Text>
      {/* <MatchList navigation={props.navigation} /> */}
      <PostsFeed type="Feed" />
      <UpdatesOverlay
        isVisible={isVisible}
        updates={updates}
        setVisible={setIsVisible}
      />
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

export default FeedScreen;
