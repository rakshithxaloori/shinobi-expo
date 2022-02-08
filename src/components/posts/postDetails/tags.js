import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  FlatList,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import FastImage from "react-native-fast-image";

import { darkTheme } from "../../../utils/theme";
import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { avatarDefaultStyling } from "../../../utils/styles";
import { flashAlert } from "../../../utils/flash_message";

const Tags = ({ tags, setTags }) => {
  const cancelTokenSource = axios.CancelToken.source();
  const [searchText, setSearchText] = useState("");
  const [searches, setSearches] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    // cleanup function
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const onChangeText = async (value) => {
    setSearchText(value);
    if (value == "") {
      setSearches([]);
      return;
    }
    const onSuccess = (response) => {
      setSearches(response.data.payload.users);
    };

    const APIKit = await createAPIKit();
    APIKit.get(`profile/search/followers/${value}/`, {
      cancelToken: cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        handleAPIError(e);
      });
  };

  const addToTags = (newTag) => {
    if (tags.length >= 10) {
      flashAlert("You can only add upto 10 tags");
      return;
    }
    if (tags.filter((e) => e.username === newTag.username).length > 0)
      flashAlert(`${newTag.username} already tagged`);
    else setTags([...tags, newTag]);
    setSearchText("");
    setSearches([]);
    Keyboard.dismiss();
  };

  const removeFromTags = (removeTag) => {
    const newTags = tags.filter((tag) => {
      tag.username !== removeTag.username;
    });
    setTags(newTags);
  };

  const renderTagItem = ({ item }) => (
    <TagItem user={item} removeUser={removeFromTags} />
  );
  const tagKeyExtractor = (item) => item.username;

  return (
    <View style={styles.container}>
      <View style={styles.inputParent}>
        <Ionicons
          name="search"
          size={20}
          color={darkTheme.on_surface_subtitle}
        />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholderTextColor={darkTheme.on_surface_subtitle}
          placeholder="Tag a follower"
          value={searchText}
          onChangeText={onChangeText}
        />
      </View>
      {keyboardVisible ? (
        <>
          {searches.length > 0 ? (
            searches.map(({ user }) => (
              <SearchItem
                key={user.username}
                user={user}
                selectUser={addToTags}
              />
            ))
          ) : searchText !== "" ? (
            <Text
              style={{ color: darkTheme.on_background, alignSelf: "center" }}
            >
              No "{searchText}" in your followers
            </Text>
          ) : null}
        </>
      ) : (
        <>
          {tags.length > 0 && (
            <Text style={{ color: darkTheme.on_background }}>
              Tagged in the post
            </Text>
          )}
          <FlatList
            data={tags}
            renderItem={renderTagItem}
            keyExtractor={tagKeyExtractor}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputParent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: darkTheme.surface,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    marginLeft: 5,
    width: "90%",
    height: "100%",
    color: darkTheme.on_background,
  },
  container: {},
});

const SearchItem = ({ user, selectUser }) => (
  <TouchableOpacity
    style={searchItemStyles.container}
    onPress={() => {
      selectUser(user);
    }}
  >
    <Avatar
      rounded
      size={40}
      title={user.username[0]}
      source={{ uri: user.picture }}
      overlayContainerStyle={avatarDefaultStyling}
      ImageComponent={FastImage}
    />
    <Text style={searchItemStyles.title}>{user.username}</Text>
  </TouchableOpacity>
);

const searchItemStyles = StyleSheet.create({
  title: {
    color: darkTheme.on_background,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 15,
  },
  container: {
    flexDirection: "row",
    height: 45,
    alignItems: "center",
  },
});

const TagItem = ({ user, removeUser }) => (
  <View style={tagItemStyles.container}>
    <Avatar
      rounded
      size={24}
      title={user.username[0]}
      source={{ uri: user.picture }}
      containerStyle={avatarDefaultStyling}
      ImageComponent={FastImage}
    />
    <Text
      style={[tagItemStyles.tagUsername, { color: darkTheme.on_surface_title }]}
    >
      {user.username}
    </Text>
    <Ionicons
      name="close-circle"
      style={tagItemStyles.removeTag}
      size={24}
      color={darkTheme.on_background}
      onPress={removeUser}
    />
  </View>
);

const tagItemStyles = StyleSheet.create({
  removeTag: { position: "absolute", right: 10 },
  tagUsername: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    color: darkTheme.on_surface_subtitle,
  },
  container: {
    flexDirection: "row",
    height: 40,
    backgroundColor: darkTheme.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Tags;
