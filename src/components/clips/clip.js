import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";
import VideoPlayer from "../../utils/feedPlayer";
import { shareClip } from "../../utils/share";

const footerIconSize = 20;
const iconColor = darkTheme.primary;

class FeedClip extends React.Component {
  shouldComponentUpdate = (nextProps) => {
    const { me_like, likes } = nextProps.clip;
    const { mute } = nextProps;
    const { me_like: prevMe_like, likes: prevLikes } = this.props.clip;
    const { mute: prevMute } = this.props;

    // If "me_like" or "likes" is different, then update
    return me_like !== prevMe_like || likes !== prevLikes || mute !== prevMute;
  };

  navigateProfile = async () => {
    await this.props.navigateProfile(this.props.clip.uploader.username);
  };

  onPressLike = () => {
    const { clip, toggleLike } = this.props;
    toggleLike(clip);
  };

  onPressShare = () => {
    const { clip } = this.props;
    shareClip(clip.id, clip.uploader.username, clip.game.name);
  };

  onPressReport = () => {
    this.props.reportClip(this.props.clip.id);
  };

  onPressDelete = () => {
    this.props.setDeleteClip(this.props.clip);
  };

  onViewedClip = () => {
    this.props.onViewedClip(this.props.clip.id);
  };

  render = () => {
    const {
      type,
      clip,
      TITLE_HEIGHT,
      VIDEO_HEIGHT,
      FOOTER_HEIGHT,
      MARGIN,
      dateDiff,
      mute,
      toggleMute,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            height: VIDEO_HEIGHT + TITLE_HEIGHT + FOOTER_HEIGHT,
            marginVertical: MARGIN,
          },
        ]}
      >
        {type === "Feed" ? (
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
        ) : type === "Profile" ? (
          <View style={[styles.touchable, { height: TITLE_HEIGHT }]}>
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
          </View>
        ) : null}
        <VideoPlayer
          videoUri={clip.url}
          onViewedClip={this.onViewedClip}
          videoRef={clip.videoRef}
          VIDEO_HEIGHT={VIDEO_HEIGHT}
          globalMute={mute}
          globalToggleMute={toggleMute}
        />
        <View style={[styles.footer, { height: FOOTER_HEIGHT }]}>
          <Text style={styles.clipTitle}>{clip.title}</Text>
          {type === "Feed" ? (
            <View style={styles.clipIconSection}>
              <View style={styles.footerIconSection}>
                <Ionicons
                  name={clip.me_like ? "heart" : "heart-outline"}
                  size={footerIconSize}
                  color={iconColor}
                  onPress={this.onPressLike}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  {clip.likes} {clip.likes === 1 ? "like" : "likes"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.footerIconSection}
                onPress={this.onPressShare}
              >
                <Ionicons
                  name={"share-social"}
                  size={footerIconSize}
                  color={iconColor}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerIconSection}
                onPress={this.onPressReport}
              >
                <Ionicons
                  name={"flag-outline"}
                  size={footerIconSize}
                  color={iconColor}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Report</Text>
              </TouchableOpacity>
            </View>
          ) : type === "Profile" ? (
            <View style={styles.clipIconSection}>
              <View style={styles.footerIconSection}>
                <Ionicons
                  name={"heart"}
                  size={footerIconSize}
                  color={iconColor}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  {clip.likes} {clip.likes === 1 ? "like" : "likes"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.footerIconSection}
                onPress={this.onSharePress}
              >
                <Ionicons
                  name={"share-social"}
                  size={footerIconSize}
                  color={iconColor}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Share</Text>
              </TouchableOpacity>
              {this.props.username === clip.uploader.username && (
                <TouchableOpacity
                  style={styles.footerIconSection}
                  onPress={this.onPressDelete}
                >
                  <Ionicons
                    name={"trash-outline"}
                    size={footerIconSize}
                    color={iconColor}
                    style={styles.icon}
                  />
                  <Text style={styles.iconText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  username: { color: darkTheme.on_primary, fontWeight: "bold" },
  game_name: { paddingLeft: 5, color: darkTheme.on_primary },
  footer: {
    width: "100%",
    justifyContent: "center",
    marginTop: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  clipTitle: {
    flex: 1,
    marginHorizontal: 20,
    fontSize: 15,
    color: darkTheme.on_surface_title,
  },
  clipIconSection: {
    flex: 2,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerIconSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { marginRight: 5 },
  iconText: { fontSize: footerIconSize - 5, color: iconColor },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: darkTheme.primary,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 10,
  },
});

export default FeedClip;
