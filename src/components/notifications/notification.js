import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";

import { dateTimeDiff } from "../../utils";
import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const screenWidth = Dimensions.get("screen").width;

const Notification = ({ avatarSize, notification, textString, onPress }) => {
  const { sender, sent_at, type, extra_data } = notification.item;

  const dateThen = new Date(sent_at);
  const dateDiff = dateTimeDiff(dateThen);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(sender, type, extra_data)}
    >
      <Avatar
        rounded
        size={avatarSize}
        title={sender.username[0]}
        source={{ uri: sender.picture }}
        overlayContainerStyle={avatarDefaultStyling}
        ImageComponent={FastImage}
      />
      <View style={styles.textArea}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          {sender.username}
        </Text>
        <Text style={styles.text}> {textString}</Text>
        <Text style={[styles.text, styles.date]}> {dateDiff}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: darkTheme.on_surface_title,
  },
  date: { color: darkTheme.on_surface_subtitle, fontWeight: "500" },
  textArea: { flexDirection: "row", marginLeft: 10 },
  container: {
    flexDirection: "row",
    width: screenWidth - 20,
    alignItems: "center",
    marginVertical: 5,
  },
});

export default Notification;
