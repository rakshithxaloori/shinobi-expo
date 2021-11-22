import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Video } from "expo-av";

import { darkTheme } from "../../../utils/theme";
import { avatarDefaultStyling } from "../../../utils/styles";

class FeedClip extends React.PureComponent {
  navigateProfile = () => {
    this.props.navigateProfile(this.props.clip.uploader.username);
  };
  render = () => {
    const { clip, TITLE_HEIGHT, VIDEO_HEIGHT, MARGIN, dateDiff } = this.props;
    return (
      <View
        style={[
          styles.container,
          { height: VIDEO_HEIGHT + TITLE_HEIGHT, marginVertical: MARGIN },
        ]}
      >
        <TouchableOpacity
          style={[styles.touchable, { height: TITLE_HEIGHT }]}
          onPress={this.navigateProfile}
        >
          <Avatar
            rounded
            source={{ uri: clip.uploader.picture }}
            ImageComponent={FastImage}
          />
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.username}>{clip.uploader.username}</Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                rounded
                size={15}
                source={{ uri: clip.game.logo_url }}
                containerStyle={avatarDefaultStyling}
                ImageComponent={FastImage}
              />
              <Text style={styles.game_name}>{clip.game.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Video
          style={[styles.video, { height: VIDEO_HEIGHT }]}
          source={{ uri: clip.url }}
          // useNativeControls
          resizeMode="contain"
          shouldPlay={false}
          isLooping={true}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  username: { color: darkTheme.on_primary, fontWeight: "bold" },
  game_name: { paddingLeft: 5, color: darkTheme.on_primary },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: darkTheme.primary,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  video: {
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default FeedClip;
