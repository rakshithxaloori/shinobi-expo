import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";
import VideoPlayer from "../../utils/feedPlayer";
import { shareClip } from "../../utils/share";

const FOOTER_ICON_SIZE = 18;
const ICON_COLOR = darkTheme.on_surface_subtitle;

class ClipPost extends React.Component {
  shouldComponentUpdate = (nextProps) => {
    const { me_like, likes } = nextProps.post;
    const { mute } = nextProps;
    const { me_like: prevMe_like, likes: prevLikes } = this.props.post;
    const { mute: prevMute } = this.props;

    // If "me_like" or "likes" is different, then update
    return me_like !== prevMe_like || likes !== prevLikes || mute !== prevMute;
  };

  navigateProfile = async () => {
    if (this.props.type === "Feed") {
      await this.props.navigateProfile(this.props.post.posted_by.username);
    }
  };

  onPressLike = () => {
    const { post, toggleLike } = this.props;
    toggleLike(post);
  };

  onPressRepost = () => {
    // TODO
    const { post } = this.props;
  };

  onPressShare = () => {
    const { post } = this.props;
    shareClip(post.id, post.posted_by.username, post.game.name);
  };

  onPressReport = () => {
    this.props.reportPost(this.props.post.id);
  };

  onPressDelete = () => {
    this.props.setDeletePost(this.props.post);
  };

  onViewedClip = () => {
    this.props.onViewedClip(this.props.post.clip.id);
  };

  render = () => {
    const {
      type,
      post,
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
            margin: MARGIN,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.touchable, { height: TITLE_HEIGHT }]}
          disabled={type === "Profile"}
          onPress={this.navigateProfile}
        >
          <Avatar
            rounded
            source={{ uri: post.posted_by.picture }}
            ImageComponent={FastImage}
          />
          <View style={{ paddingLeft: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.username}>{post.posted_by.username}</Text>
              <Text style={styles.bullet}>{"\u0387"}</Text>
              <Text style={styles.date}>{dateDiff}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                rounded
                size={15}
                source={{ uri: post.game.logo_url }}
                containerStyle={avatarDefaultStyling}
                ImageComponent={FastImage}
              />
              <Text style={styles.game_name}>{post.game.name}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <VideoPlayer
          onViewedClip={this.onViewedClip}
          videoRef={post.videoRef}
          VIDEO_HEIGHT={VIDEO_HEIGHT}
          globalMute={mute}
          globalToggleMute={toggleMute}
        />
        <View style={[styles.footer, { height: FOOTER_HEIGHT }]}>
          <Text style={styles.clipTitle}>{post.title}</Text>
          <View style={styles.clipIconSection}>
            <TouchableOpacity
              style={styles.footerIconSection}
              onPress={this.onPressLike}
            >
              <Ionicons
                name={post.me_like ? "heart" : "heart-outline"}
                size={FOOTER_ICON_SIZE}
                color={post.me_like ? "red" : ICON_COLOR}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.likes)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerIconSection}
              onPress={this.onPressRepost}
            >
              <Ionicons
                name={"refresh-outline"}
                size={FOOTER_ICON_SIZE}
                color={ICON_COLOR}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.reposts)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerIconSection}
              onPress={this.onPressShare}
            >
              <Ionicons
                name={"share-social-outline"}
                size={FOOTER_ICON_SIZE}
                color={ICON_COLOR}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.shares)}</Text>
            </TouchableOpacity>

            {/* {this.props.username === post.posted_by.username ? (
              <TouchableOpacity
                style={styles.footerIconSection}
                onPress={this.onPressDelete}
              >
                <Ionicons
                  name={"trash-outline"}
                  size={FOOTER_ICON_SIZE}
                  color={ICON_COLOR}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Delete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.footerIconSection}
                onPress={this.onPressReport}
              >
                <Ionicons
                  name={"flag-outline"}
                  size={FOOTER_ICON_SIZE}
                  color={ICON_COLOR}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Report</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  username: { color: darkTheme.on_primary, fontWeight: "bold" },
  bullet: { marginHorizontal: 5 },
  date: { color: darkTheme.on_primary },
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
  iconText: { fontSize: FOOTER_ICON_SIZE - 1, color: ICON_COLOR },
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

const prettyNumber = (number) => {
  if (number < 10 * 1000) {
    // Less than 10K
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (number < 1000 * 1000) {
    // 10K, 1M
    return `${((number * 1.0) / 1000).toFixed(1)}K`;
  }
  if (number < 1000 * 1000 * 1000) {
    // 1M, 1B
    return `${((number * 1.0) / (1000 * 1000)).toFixed(1)}M`;
  }
};

export default ClipPost;
