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
import PostDetails from "../posts/postDetails";

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
  tags,
  setTags,
}) => {
  const navigation = useNavigation();
  const cancelTokenSource = axios.CancelToken.source();

  const _keyboardDidShow = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);

  const _keyboardDidHide = React.useCallback(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: "flex",
        ...tabBarStyles.tabBarStyle,
      },
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

  return (
    <View style={styles.container}>
      <PostDetails
        title={title}
        setTitle={onChangeTitle}
        game={selectedGame}
        setGame={setSelectedGame}
        tags={tags}
        setTags={setTags}
        disable={disable}
        finish={uploadVideo}
        iconName="cloud-upload"
        buttonText={is_uploading ? "Uploading..." : "Upload Clip"}
      />
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
