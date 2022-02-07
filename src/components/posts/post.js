import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../utils/theme";
import { avatarDefaultStyling } from "../../utils/styles";
import VideoPlayer from "../../utils/feedPlayer";
import { shareClip } from "../../utils/share";

const REPOST_FONT_SIZE = 15;

const FOOTER_ICON_SIZE = 18;
const FOOTER_ICON_COLOR = darkTheme.on_surface_subtitle;

const HEADER_ICON_SIZE = 22;
const HEADER_ICON_COLOR = darkTheme.on_primary;

class Post extends React.Component {
  shouldComponentUpdate = (nextProps) => {
    const { me_like, likes, title, game, tags } = nextProps.post;
    const { mute, play } = nextProps;
    const {
      me_like: prevMe_like,
      likes: prevLikes,
      title: prevTitle,
      game: prevGame,
      tags: prevTags,
    } = this.props.post;
    const { mute: prevMute, play: prevPlay } = this.props;

    const shouldUpdate =
      me_like !== prevMe_like ||
      likes !== prevLikes ||
      play !== prevPlay ||
      mute !== prevMute ||
      title !== prevTitle ||
      game !== prevGame ||
      !areEqual(tags, prevTags);

    return shouldUpdate;
  };

  goToProfile = async () => {
    const { type, post, navigateProfile } = this.props;
    if (type === "Feed") {
      if (post.is_repost) await navigateProfile(post.reposted_by.username);
      else await navigateProfile(post.posted_by.username);
    } else if (
      type === "Profile" &&
      post.posted_by.username !== post.reposted_by.username
    )
      await navigateProfile(post.posted_by.username);
  };

  onPressTags = () => {
    const { post, toggleTagsOverlay } = this.props;
    toggleTagsOverlay(post);
  };

  onPressLike = () => {
    const { post, toggleLike } = this.props;
    toggleLike(post);
  };

  onPressRepost = () => {
    const { post } = this.props;
    this.props.repostPost(post);
  };

  onPressShare = () => {
    const { post } = this.props;
    shareClip(post.id, post.title, post.posted_by.username, post.game.name);
  };

  setSelectedPost = () => {
    this.props.setSelectedPost(this.props.post);
  };

  onViewedClip = () => {
    this.props.onViewedClip(this.props.post.clip.id);
  };

  render = () => {
    const {
      type,
      post,
      hToWRatio,
      dateDiff,
      play,
      mute,
      togglePlay,
      toggleMute,
    } = this.props;

    return (
      <View style={styles.container}>
        {post.is_repost && (
          <View style={styles.repost}>
            <Ionicons
              name={"refresh-outline"}
              size={FOOTER_ICON_SIZE}
              color={darkTheme.on_background}
              style={styles.footerIcon}
            />
            <Text
              style={{
                color: darkTheme.on_background,
                fontSize: REPOST_FONT_SIZE,
              }}
            >
              {post.reposted_by.username} Reposted
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.titleBar}
          disabled={
            !(
              type === "Feed" ||
              (post.is_repost &&
                post.posted_by.username !== post.reposted_by.username)
            )
          }
          onPress={this.goToProfile}
        >
          <Avatar
            rounded
            source={{ uri: post.posted_by.picture }}
            ImageComponent={FastImage}
          />
          <View style={{ paddingLeft: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          <Ionicons
            name="ellipsis-vertical-outline"
            size={HEADER_ICON_SIZE}
            color={HEADER_ICON_COLOR}
            style={styles.headerIcon}
            onPress={this.setSelectedPost}
          />
        </TouchableOpacity>
        <View
          style={{
            margin: 10,
            justifyContent: "center",
          }}
        >
          <Text style={styles.clipTitle}>{post.title}</Text>
          {post.tags.length > 0 && (
            <TouchableOpacity style={styles.tags} onPress={this.onPressTags}>
              <Text style={styles.tagsText}>
                - with{" "}
                {post.tags.length > 1
                  ? `${post.tags[0].username} and ${
                      post.tags.length - 1
                    } others`
                  : `${post.tags[0].username}`}{" "}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <VideoPlayer
          onViewedClip={this.onViewedClip}
          videoRef={post.videoRef}
          hToWRatio={hToWRatio}
          globalPlay={play}
          globalTogglePlay={togglePlay}
          globalMute={mute}
          globalToggleMute={toggleMute}
        />
        <View style={styles.footer}>
          <View style={styles.clipIconSection}>
            <TouchableOpacity
              style={styles.footerIconTouchable}
              onPress={this.onPressLike}
            >
              <Ionicons
                name={post.me_like ? "heart" : "heart-outline"}
                size={FOOTER_ICON_SIZE}
                color={post.me_like ? "red" : FOOTER_ICON_COLOR}
                style={styles.footerIcon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.likes)}</Text>
            </TouchableOpacity>
            {post.clip.view_count !== null && (
              <View
                style={styles.footerIconTouchable}
                onPress={this.onPressLike}
              >
                <Ionicons
                  name={"play"}
                  size={FOOTER_ICON_SIZE}
                  color={FOOTER_ICON_COLOR}
                  style={styles.footerIcon}
                />
                <Text style={styles.iconText}>
                  {prettyNumber(post.clip.view_count)}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.footerIconTouchable}
              onPress={this.onPressRepost}
            >
              <Ionicons
                name={"refresh-outline"}
                size={FOOTER_ICON_SIZE}
                color={FOOTER_ICON_COLOR}
                style={styles.footerIcon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.reposts)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerIconTouchable}
              onPress={this.onPressShare}
            >
              <Ionicons
                name={"share-social-outline"}
                size={FOOTER_ICON_SIZE}
                color={FOOTER_ICON_COLOR}
                style={styles.footerIcon}
              />
              <Text style={styles.iconText}>{prettyNumber(post.shares)}</Text>
            </TouchableOpacity>
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
  headerIcon: { position: "absolute", right: 6, paddingHorizontal: 4 },
  game_name: { paddingLeft: 5, color: darkTheme.on_primary },
  footer: {
    width: "100%",
    justifyContent: "center",
    marginVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  clipTitle: {
    marginBottom: 5,
    fontSize: 15,
    color: darkTheme.on_surface_title,
  },
  clipIconSection: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerIconTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerIcon: { marginRight: 5 },
  iconText: { fontSize: FOOTER_ICON_SIZE - 1, color: FOOTER_ICON_COLOR },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: darkTheme.primary,
    paddingVertical: 10,
  },
  repost: {
    flexDirection: "row",
    backgroundColor: darkTheme.background,
    alignItems: "center",
    marginBottom: 5,
    marginLeft: 5,
  },
  tags: { marginLeft: 5 },
  tagsText: { color: darkTheme.on_surface_subtitle },
  container: {
    backgroundColor: darkTheme.surface,
    marginBottom: 15,
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

function areEqual(array1, array2) {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}

export default Post;
