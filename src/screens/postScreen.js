import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../utils";
import ClipPost from "../components/posts/post";
import ReportOverlay from "../components/posts/reportOverlay";
import { clipUrlByNetSpeed, getVideoHeight } from "../utils/clipUtils";
import { darkTheme } from "../utils/theme";
import { shareClip } from "../utils/share";
import TagsOverlay from "../components/posts/tagsOverlay";

const screenWidth = Dimensions.get("window").width;

class PostScreen extends Component {
  state = { post: null, mute: false, play: true, showTagsOverlay: false };
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const onSuccess = (response) => {
      const loadClip = async () => {
        this.state.post.videoRef.current.loadAsync(
          { uri: clipUrlByNetSpeed(this.state.post.clip.url) },
          // { shouldPlay: true, isLooping: true, isMuted: this.state.mute }
          { shouldPlay: true, isMuted: this.state.mute }
        );
      };

      const { post } = response.data.payload;
      const clipWithRef = { ...post, videoRef: React.createRef() };
      this.setState({ post: clipWithRef }, loadClip);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "feed/post/",
      { post_id: this.props.route?.params?.post_id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  unmountVideo = async () => {
    this.state.post && (await this.state.post.videoRef.current.unloadAsync());
  };

  componentWillUnmount = async () => {
    await this.unmountVideo();
  };

  navigateProfile = async (username) => {
    await this.unmountVideo();
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "Profile", params: { username } }],
    });

    this.props.navigation.dispatch(resetAction);
  };

  reportPost = (post_id) => {
    this.setState({ reportClipId: post_id });
  };

  onViewedClip = async () => {
    const APIKit = await createAPIKit();
    APIKit.post(
      "clips/viewed/",
      { clip_id: this.state.post.clip.id },
      { cancelToken: this.cancelTokenSource.token }
    ).catch((e) => {
      flashAlert(handleAPIError(e));
    });
  };

  toggleTags = () => {
    this.setState((prevState) => ({
      showTagsOverlay: !prevState.showTagsOverlay,
    }));
  };

  togglePlay = () => {
    this.setState((prevState) => ({ play: !prevState.play }));
  };

  toggleMute = () => {
    this.setState((prevState) => ({ mute: !prevState.mute }));
  };

  toggleLike = async (post) => {
    const onSuccess = () => {
      let newPost = {
        ...post,
        me_like: !post.me_like,
        likes: post.me_like ? post.likes - 1 : post.likes + 1,
      };
      this.setState({ clip: newPost });
    };
    const APIKit = await createAPIKit();
    let url = null;
    if (post.me_like) url = "feed/post/unlike/";
    else url = "feed/post/like/";
    APIKit.post(
      url,
      { post_id: post.id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  render = () => {
    if (this.state.post !== null) {
      const dateThen = new Date(this.state.post?.created_datetime);
      const dateDiff = dateTimeDiff(dateThen);

      let post_id = this.state.post.id;
      let title = this.state.post?.title;
      let username = this.state.post?.posted_by?.username;
      let game_name = this.state.post?.game?.name;

      if (this.state.post.is_repost) {
        username = this.state.post.reposted_by.username;
      }

      return (
        <View style={styles.container}>
          <ClipPost
            type={"Feed"}
            post={this.state.post}
            dateDiff={dateDiff}
            navigateProfile={this.navigateProfile}
            reportPost={this.reportPost}
            onViewedClip={this.onViewedClip}
            mute={this.state.mute}
            play={this.state.play}
            toggleTagsOverlay={this.toggleTags}
            togglePlay={this.togglePlay}
            toggleMute={this.toggleMute}
            toggleLike={this.toggleLike}
          />
          <TouchableOpacity
            onPress={() => {
              shareClip(post_id, title, username, game_name);
            }}
            style={styles.button}
          >
            <Ionicons
              style={styles.icon}
              name="share-social-outline"
              size={25}
              color={darkTheme.on_background}
            />
            <Text style={styles.buttonText}>Share Clip</Text>
          </TouchableOpacity>
          {this.state.reportClipId && (
            <ReportOverlay
              post_id={this.state.reportClipId}
              clearReport={this.clearReport}
            />
          )}
          {this.state.showTagsOverlay && (
            <TagsOverlay
              post={this.state.post}
              showOverlay={this.state.showTagsOverlay}
              hideTagsOverlay={this.toggleTags}
            />
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LottieView
            style={{
              width: 0.8 * screenWidth,
              height: 0.8 * screenWidth,
            }}
            autoPlay
            source={require("../../assets/1049-hourglass.json")}
          />
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  icon: { marginRight: 8 },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: darkTheme.on_background,
  },
  button: {
    borderRadius: 30,
    padding: 15,
    margin: 10,
    flexDirection: "row",
    backgroundColor: darkTheme.primary,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: { flex: 1, alignItems: "center" },
});

export default PostScreen;
