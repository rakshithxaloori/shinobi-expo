import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";

import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../utils";
import ClipPost from "../components/posts/post";
import ReportOverlay from "../components/posts/reportOverlay";
import { clipUrlByNetSpeed, getVideoHeight } from "../utils/clipUtils";
import { darkTheme } from "../utils/theme";

const screenWidth = Dimensions.get("window").width;

const REPOST_HEIGHT = 40;
const TITLE_HEIGHT = 60;
const FOOTER_HEIGHT = 80;
const ITEM_MARGIN = 15;

class PostScreen extends Component {
  state = { post: null, mute: false };
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

      const video_height = getVideoHeight(
        this.state.post?.clip.height,
        this.state.post?.clip.width
      );
      return (
        <View style={styles.container}>
          <Text style={styles.share}>Share the post with your friends?</Text>
          <ClipPost
            type={"Feed"}
            post={this.state.post}
            REPOST_HEIGHT={REPOST_HEIGHT}
            TITLE_HEIGHT={TITLE_HEIGHT}
            VIDEO_HEIGHT={video_height}
            FOOTER_HEIGHT={FOOTER_HEIGHT}
            MARGIN={ITEM_MARGIN}
            dateDiff={dateDiff}
            navigateProfile={this.navigateProfile}
            reportPost={this.reportPost}
            onViewedClip={this.onViewedClip}
            mute={this.state.mute}
            toggleMute={this.toggleMute}
            toggleLike={this.toggleLike}
          />
          {this.state.reportClipId && (
            <ReportOverlay
              post_id={this.state.reportClipId}
              clearReport={this.clearReport}
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
  share: {
    color: darkTheme.on_background,
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  container: { flex: 1 },
});

export default PostScreen;
