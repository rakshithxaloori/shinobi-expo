import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";
import { MAX_TITLE_LENGTH } from "../../utils";

const ICON_SIZE = 20;

const PostTitle = ({ title, onChangeTitle, disable }) => (
  <View>
    <View style={[styles.inputParent, { marginBottom: 5 }]}>
      <MaterialCommunityIcons
        name="card-text"
        size={ICON_SIZE}
        color={darkTheme.on_background}
      />
      <TextInput
        editable={!disable}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          {
            color:
              title.length > MAX_TITLE_LENGTH ? "red" : darkTheme.on_background,
          },
        ]}
        placeholderTextColor={darkTheme.on_surface_subtitle}
        multiline
        placeholder="Clip Title"
        value={title}
        onChangeText={(value) => {
          const newValue = value.replace(/\s+/g, " ");
          onChangeTitle(newValue);
        }}
      />
    </View>
    <Text
      style={[
        styles.count,
        {
          color:
            title.length > MAX_TITLE_LENGTH ? "red" : darkTheme.on_background,
        },
      ]}
    >
      {title.length}/{MAX_TITLE_LENGTH}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  clipLabel: {
    width: "100%",
    height: "20%",
  },
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
  count: {
    alignSelf: "flex-end",
  },
});

export default PostTitle;
