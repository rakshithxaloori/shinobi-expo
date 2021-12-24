import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { createAPIKit } from "../../utils/APIKit";
import { flashAlert } from "../../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";
import Post from "./post";
import ReportOverlay from "./reportOverlay";
import DeleteOverlay from "./deleteOverlay";
import { shimmerColors } from "../../utils/styles";
import { clipUrlByNetSpeed } from "../../utils/clipUrl";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const TITLE_HEIGHT = 60;
const FOOTER_HEIGHT = 80;
const ITEM_MARGIN = 10;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const getVideoHeight = (video_height, video_width) => {
  const min_height = Math.min(
    (video_height * screenWidth) / video_width,
    0.6 * screenHeight,
    450
  );
  return min_height;
};

class Posts extends Component {
  state = {
    posts: [],
    viewable: null,
    mute: true,
    initLoaded: false,
    isLoading: true,
    endReached: false,
    reportPostId: undefined,
    deletePost: undefined,
    showDeleteOverlay: false,
  };

  fetchCount = 10;
  cancelTokenSource = axios.CancelToken.source();

  placeholder = (
    <View style={{ marginBottom: 20, alignItems: "center" }}>
      <ShimmerPlaceHolder
        width={screenWidth - 40}
        height={250}
        shimmerStyle={{
          borderRadius: 10,
        }}
        shimmerColors={shimmerColors}
      />
    </View>
  );

  componentDidMount = async () => {
    this._unsubscribeFocus = this.props.navigation.addListener(
      "focus",
      this.playViewableVideo
    );
    this._unsubscribeBlur = this.props.navigation.addListener(
      "blur",
      this.pauseViewableVideo
    );

    await this.fetchPosts();
  };

  componentWillUnmount = async () => {
    await this.unmountViewableVideo();
    this.cancelTokenSource.cancel();
    this._unsubscribeFocus && this._unsubscribeFocus();
    this._unsubscribeBlur && this._unsubscribeBlur();
  };

  unmountViewableVideo = async () => {
    this.state.viewable?.videoRef?.current &&
      (await this.state.viewable.videoRef.current.unloadAsync());
  };

  playViewableVideo = async () => {
    this.state.viewable?.videoRef?.current &&
      (await this.state.viewable.videoRef.current.playAsync());
  };

  pauseViewableVideo = async () => {
    this.state.viewable?.videoRef?.current &&
      (await this.state.viewable.videoRef.current.pauseAsync());
  };

  deletePostFromList = async (post) => {
    const post_id = post.id;
    post.videoRef.current && (await post.videoRef.current.unloadAsync());
    const filteredData = this.state.posts.filter((item) => item.id !== post_id);
    this.setState({ posts: filteredData });
  };

  fetchPosts = async () => {
    if (this.state.endReached) return;
    const onSuccess = (response) => {
      const { posts } = response.data.payload;
      const clipsWithRef = posts.map((post) => ({
        ...post,
        videoRef: React.createRef(),
      }));

      this.setState((prevState) => ({
        initLoaded: true,
        isLoading: false,
        posts: [...prevState.posts, ...clipsWithRef],
        endReached: posts.length < this.fetchCount,
      }));
    };

    const APIKit = await createAPIKit();
    const dateNow = new Date();
    let url = undefined;
    let postData = undefined;
    if (this.props.type === "Feed") {
      url = "/feed/posts/following/";
      postData = {
        datetime:
          this.state.posts[this.state.posts.length - 1]?.created_datetime ||
          dateNow,
      };
    } else if (this.props.type === "Profile") {
      url = "/feed/posts/profile/";
      postData = {
        username: this.props.username,
        datetime:
          this.state.posts[this.state.posts.length - 1]?.created_datetime ||
          dateNow,
      };
    }

    APIKit.post(url, postData, { cancelToken: this.cancelTokenSource.token })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  reportPost = (post_id) => {
    this.setState({ reportPostId: post_id });
  };

  clearReport = () => {
    this.setState({ reportPostId: undefined });
  };

  setDeletePost = (post) => {
    this.setState({ deletePost: post, showDeleteOverlay: true });
  };

  onViewedClip = async (clip_id) => {
    const APIKit = await createAPIKit();
    APIKit.post(
      "clips/viewed/",
      { clip_id },
      { cancelToken: this.cancelTokenSource.token }
    ).catch((e) => {
      flashAlert(handleAPIError(e));
    });
  };

  renderPost = ({ item }) => {
    const dateThen = new Date(item.created_datetime);
    const dateDiff = dateTimeDiff(dateThen);

    const video_height = getVideoHeight(item.clip.height, item.clip.width);

    if (this.props.type === "Feed") {
      return (
        <Post
          type={this.props.type}
          post={item}
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
      );
    } else if (this.props.type === "Profile") {
      return (
        <Post
          type={this.props.type}
          username={this.props.username}
          post={item}
          TITLE_HEIGHT={TITLE_HEIGHT}
          VIDEO_HEIGHT={video_height}
          FOOTER_HEIGHT={FOOTER_HEIGHT}
          MARGIN={ITEM_MARGIN}
          dateDiff={dateDiff}
          setDeletePost={this.setDeletePost}
          onViewedClip={this.onViewedClip}
          toggleOverlay={this.toggleOverlay}
          mute={this.state.mute}
          toggleMute={this.toggleMute}
        />
      );
    }
  };

  keyExtractor = (post) => {
    return post.id;
  };

  getItemLayout = (data, index) => {
    const video_height = getVideoHeight(
      data[index].clip.height,
      data[index].clip.width
    );

    const item_height = video_height + TITLE_HEIGHT + FOOTER_HEIGHT;
    return {
      length: item_height,
      offset: (item_height + ITEM_MARGIN) * index,
      index,
    };
  };

  navigateProfile = async (username) => {
    await this.unmountViewableVideo();
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "Profile", params: { username } }],
    });

    this.props.navigation.dispatch(resetAction);
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
      this.setState((prevState) => {
        return {
          posts: prevState.posts.map((item) =>
            item.id === newPost.id ? newPost : item
          ),
        };
      });
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

  toggleOverlay = () => {
    this.setState((prevState) => ({
      showDeleteOverlay: !prevState.showDeleteOverlay,
    }));
  };

  onViewableItemsChanged = async ({ viewableItems, changed }) => {
    // Unload changed but not viewable
    for (const changedItem of changed) {
      if (!changedItem.isViewable) {
        console.log("Unloading", changedItem.index);
        const { item } = changedItem;
        item?.videoRef?.current && (await item.videoRef.current.unloadAsync());
      }
    }

    // Load the first viewable
    const loadCurrentViewable = async (currentViewable) => {
      console.log("Loading", currentViewable.index);
      const videoUri = clipUrlByNetSpeed(currentViewable.item.clip.url);
      console.log(videoUri);

      await currentViewable.item.videoRef.current.loadAsync(
        { uri: videoUri },
        // { shouldPlay: true, isLooping: true, isMuted: this.state.mute }
        { shouldPlay: true, isMuted: this.state.mute }
      );
      this.setState({ viewable: currentViewable.item });
    };

    if (viewableItems.length > 0) {
      const viewable = viewableItems[0];

      if (this.state.viewable === null) {
        await loadCurrentViewable(viewable);
      } else if (viewable != this.state.viewable) {
        this.state.viewable?.videoRef?.current &&
          (await this.state.viewable.videoRef.current.unloadAsync());
        await loadCurrentViewable(viewable);
      }
    }
  };

  render = () =>
    this.state.initLoaded ? (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          data={this.state.posts}
          onEndReached={this.fetchPosts}
          onEndReachedThreshold={1}
          renderItem={this.renderPost}
          keyExtractor={this.keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color={darkTheme.on_background}
            />
          }
          // Optimizations
          maxToRenderPerBatch={10}
          getItemLayout={this.getItemLayout}
          // View controls
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 60,
          }}
        />
        {this.state.reportPostId && (
          <ReportOverlay
            post_id={this.state.reportPostId}
            clearReport={this.clearReport}
          />
        )}
        {this.state.showDeleteOverlay && (
          <DeleteOverlay
            post={this.state.deletePost}
            showOverlay={this.state.showDeleteOverlay}
            toggleOverlay={this.toggleOverlay}
            deletePostFromList={this.deletePostFromList}
          />
        )}
      </View>
    ) : (
      <View style={styles.container}>
        {this.placeholder}
        {this.placeholder}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
  },
});

export default function (props) {
  const navigation = useNavigation();
  return <Posts {...props} navigation={navigation} />;
}
