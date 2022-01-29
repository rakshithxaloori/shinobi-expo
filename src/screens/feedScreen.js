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
import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import UpdatesOverlay from "../components/feed/updatesOverlay";

const PADDING_TOP = Constants.statusBarHeight;

const FeedScreen = (props) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [isVisible, setIsVisible] = React.useState(false);
  const [updates, setUpdates] = React.useState([]);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    const checkAppUpdate = async () => {
      const fetchUpdates = async () => {
        const onSuccess = async (response) => {
          const _showUpdates = async () => {
            setUpdates(updates);
            setIsVisible(true);

            // Set that updates of Constants.manifest.version are shown
            await SecureStore.setItemAsync(
              "updatesShownVersion",
              Constants.manifest.version
            );
          };
          const { updates, update_available } = response.data?.payload;

          if (update_available === false) {
            try {
              const updateVersion = await SecureStore.getItemAsync(
                "updatesShownVersion"
              );
              if (
                updateVersion === undefined ||
                updateVersion === null ||
                updateVersion !== Constants.manifest.version
              ) {
                await _showUpdates();
              }
            } catch (e) {
              await _showUpdates();
            }
          } else {
            // Show that update is available
            setUpdateAvailable(update_available);
            setIsVisible(true);
          }
        };

        const APIKit = await createAPIKit();

        APIKit.post(
          "ux/updates/",
          { version: Constants.manifest.version },
          { cancelToken: cancelTokenSource.token }
        )
          .then(onSuccess)
          .catch((e) => {
            console.log(handleAPIError(e, false));
          });
      };

      await fetchUpdates();
    };
    checkAppUpdate();
  }, []);

  const { navigation } = props;

  const { user } = useContext(AuthContext);

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateSearch = () => {
    navigation.navigate("Search");
  };

  const navigateSettings = () => {
    navigation.navigate("Settings");
  };

  const renderHeader = () => (
    <View style={styles.titleBar}>
      <View style={{ flexDirection: "row" }}>
        <Avatar
          rounded
          size={55}
          title={user?.username[0]}
          source={{ uri: user?.picture }}
          containerStyle={[styles.avatar, avatarDefaultStyling]}
          onPress={navigateProfile}
          ImageComponent={FastImage}
        />
        <View>
          <Text style={styles.title}>Welcome back,</Text>
          <Text style={styles.name}>{user?.username}</Text>
        </View>
      </View>
      <View style={styles.options}>
        <TouchableOpacity onPress={navigateSearch} style={{ marginRight: 10 }}>
          <Ionicons name="search-sharp" size={32} color={darkTheme.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateSettings}>
          <Ionicons name="settings" size={32} color={darkTheme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <PostsFeed type="Feed" feedType={2} renderHeader={renderHeader} />
      <UpdatesOverlay
        isVisible={isVisible}
        updateAvailable={updateAvailable}
        updates={updates}
        setVisible={setIsVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginHorizontal: 20,
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
    top: PADDING_TOP,
  },
  titleBar: {
    width: "100%",
    paddingTop: PADDING_TOP,
    paddingBottom: 10,
    backgroundColor: darkTheme.background,
  },

  header: {
    color: darkTheme.on_background,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
    textTransform: "lowercase",
    textDecorationLine: "underline",
  },

  container: {
    height: "100%",
    width: "100%",
  },
});

export default FeedScreen;
