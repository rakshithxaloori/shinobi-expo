import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SearchGame from "../../game/searchGame";
import SelectedGame from "../../game/selectedGame";
import PostTitle from "../postTitle";
import Tags from "./tags";
import { darkTheme } from "../../../utils/theme";

const ICON_SIZE = 20;

const PostDetails = ({
  title,
  setTitle,
  game,
  setGame,
  tags,
  setTags,
  disable,
  finish,
  iconName,
  buttonText,
}) => {
  // Only take and return values that post uses
  const [showTags, setShowTags] = React.useState(false);

  const onSelectGame = (newSelectedGame) => {
    setGame(newSelectedGame);
  };

  const onRemoveGame = () => {
    if (disable) return;
    setGame(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {showTags ? (
        <>
          <Tags tags={tags} setTags={setTags} />
          <TouchableOpacity
            disabled={disable}
            onPress={() => setShowTags(false)}
            style={styles.button}
          >
            <Ionicons
              style={styles.icon}
              name="pricetags"
              size={ICON_SIZE}
              color={darkTheme.on_primary}
            />
            <Text style={styles.btnText}>Tag 'em</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <PostTitle title={title} onChangeTitle={setTitle} disable={disable} />
          {game ? (
            <SelectedGame selectedGame={game} onRemoveGame={onRemoveGame} />
          ) : (
            <SearchGame onSelectGame={onSelectGame} disable={disable} />
          )}
          <TouchableOpacity
            style={styles.tags}
            onPress={() => setShowTags(!showTags)}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                name="pricetag"
                size={ICON_SIZE}
                color={darkTheme.on_background}
                style={styles.icon}
              />
              <Text style={styles.tagsText}>
                {tags.length > 1
                  ? `Tagged ${tags[0].username} and ${tags.length - 1} others`
                  : tags.length > 0
                  ? `Tagged ${tags[0].username}`
                  : "Add tags"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disable}
            onPress={finish}
            style={styles.button}
          >
            <Ionicons
              style={styles.icon}
              name={iconName}
              size={ICON_SIZE}
              color={darkTheme.on_primary}
            />
            <Text style={styles.btnText}>{buttonText}</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tags: { margin: 10 },
  tagsText: { color: darkTheme.on_background },
  icon: { marginRight: 8 },
  btnText: { fontSize: 18, fontWeight: "bold", color: darkTheme.on_primary },
  button: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 15,
    margin: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: darkTheme.primary,
    position: "absolute",
    bottom: 5,
  },
  container: {
    // flex: 1,
    height: "100%",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostDetails;
