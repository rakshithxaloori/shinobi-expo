import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { darkTheme } from "../../utils/theme";
import { tabBarStyles } from "../home";

import SearchGame from "../game/searchGame";
import SelectedGame from "../game/selectedGame";
import PostTitle from "../posts/postTitle";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = 20;

const TitleGame = ({
  is_uploading,
  disable,
  title,
  onChangeTitle,
  uploadVideo,
  selectedGame,
  setSelectedGame,
}) => {
  const navigation = useNavigation();
  const cancelTokenSource = axios.CancelToken.source();

  const [showSearchBar, setShowSearchBar] = React.useState(true);

  const _keyboardDidShow = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);

  const _keyboardDidHide = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: { display: "flex", ...tabBarStyles.tabBarStyle },
    });
  }, [navigation]);

  React.useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  React.useEffect(() => {
    const showListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const hideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    // cleanup function
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [_keyboardDidHide, _keyboardDidShow]);

  const onSelectGame = (newSelectedGame) => {
    setSelectedGame(newSelectedGame);
    setShowSearchBar(false);
  };

  const onRemoveGame = () => {
    if (disable) return;
    setSelectedGame(null);
    setShowSearchBar(true);
  };

  return (
    <View style={styles.container}>
      <PostTitle
        title={title}
        onChangeTitle={onChangeTitle}
        disable={disable}
      />

      {selectedGame && (
        <SelectedGame selectedGame={selectedGame} onRemoveGame={onRemoveGame} />
      )}

      {showSearchBar && (
        <SearchGame onSelectGame={onSelectGame} disable={disable} />
      )}

      {is_uploading ? (
        <Text style={styles.uploadingText}>Uploading clip...</Text>
      ) : (
        <TouchableOpacity
          disabled={disable}
          onPress={uploadVideo}
          style={styles.uploadButton}
        >
          <Ionicons
            style={styles.icon}
            name="cloud-upload"
            size={ICON_SIZE}
            color={darkTheme.primary}
          />
          <Text style={styles.uploadText}>Upload Video</Text>
        </TouchableOpacity>
      )}
      <Text
        style={styles.requestGameText}
        onPress={() => {
          navigation.navigate("Request Game");
        }}
      >
        Request a game
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: height - 300,
    marginVertical: 20,
    justifyContent: "center",
  },
  icon: { marginRight: 8 },
  uploadingText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: darkTheme.primary,
    color: darkTheme.on_background,
    borderRadius: 30,
    padding: 15,
    margin: 20,
    alignSelf: "center",
  },
  uploadText: { fontSize: 18, fontWeight: "bold", color: darkTheme.primary },
  uploadButton: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 15,
    margin: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.background,
  },
  requestGameText: {
    marginTop: 20,
    color: darkTheme.on_surface_title,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
});

export default TitleGame;
