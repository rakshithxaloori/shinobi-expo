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
    const { clip, HEIGHT, MARGIN, dateDiff } = this.props;
    return (
      <View
        style={[styles.container, { height: HEIGHT, marginVertical: MARGIN }]}
      >
        <TouchableOpacity
          style={styles.touchable}
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
          style={styles.video}
          source={{
            uri: clip.url,
          }}
          useNativeControls
          resizeMode="cover"
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
    flex: 1,
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: darkTheme.primary,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  video: {
    flex: 4,
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
