import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import axios from "axios";

import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../utils";
import FeedClip from "../components/posts/post";
import ReportOverlay from "../components/posts/reportOverlay";
import { clipUrlByNetSpeed } from "../utils/clipUrl";

const screenHeight = Dimensions.get("window").height;

const TITLE_HEIGHT = 60;
const FOOTER_HEIGHT = 80;
const ITEM_MARGIN = 10;

const getVideoHeight = (video_height) => {
  const min_height = Math.min(video_height, screenHeight - 300);
  return min_height;
};

class PostScreen extends Component {
  state = { clip: null, mute: false };
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const onSuccess = (response) => {
      const loadClip = async () => {
        this.state.clip.videoRef.current.loadAsync(
          { uri: clipUrlByNetSpeed(this.state.clip.url) },
          // { shouldPlay: true, isLooping: true, isMuted: this.state.mute }
          { shouldPlay: true, isMuted: this.state.mute }
        );
      };

      const { clip } = response.data.payload;
      const clipWithRef = { ...clip, videoRef: React.createRef() };
      this.setState({ clip: clipWithRef }, loadClip);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "clips/clip/",
      { post_id: this.props.route?.params?.post_id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  unmountVideo = async () => {
    this.state.clip && (await this.state.clip.videoRef.current.unloadAsync());
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

  onViewedClip = async (post_id) => {
    const APIKit = await createAPIKit();
    APIKit.post(
      "clips/viewed/",
      { post_id },
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
    if (this.state.clip !== null) {
      const dateThen = new Date(this.state.clip?.created_datetime);
      const dateDiff = dateTimeDiff(dateThen);

      const video_height = getVideoHeight(this.state.clip?.height);
      return (
        <View style={styles.container}>
          <FeedClip
            type={"Feed"}
            clip={this.state.clip}
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
      return null;
    }
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default PostScreen;
