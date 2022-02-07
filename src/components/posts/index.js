import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { createAPIKit } from "../../utils/APIKit";
import { flashAlert } from "../../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";
import Post from "./post";
import ReportOverlay from "./reportOverlay";
import DeleteOverlay from "./deleteOverlay";
import { clipUrlByNetSpeed } from "../../utils/clipUtils";
import AuthContext from "../../authContext";
import RepostOverlay from "./repostOverlay";
import TagsOverlay from "./tagsOverlay";

const screenWidth = Dimensions.get("window").width;

const ICON_SIZE = 25;

const SHEET_ICON_COLOR = darkTheme.on_surface_title;
const SHEET_ICON_SIZE = 22;
const SHEET_ITEM_MARGIN = 5;
const SHEET_ITEM_HEIGHT = 40;

const INITIAL_STATE = {
  posts: [],
  is_upload: false,
  viewable: null,
  play: false,
  mute: true,
  initLoaded: false,
  isLoading: true,
  endReached: false,
  selectedPost: null,
  showTagsOverlay: false,
  showReportOverlay: false,
  showDeleteOverlay: false,
  showRepostOverlay: false,
};

class Posts extends Component {
  static contextType = AuthContext;

  state = {
    ...INITIAL_STATE,
  };

  fetchCount = 10;
  cancelTokenSource = axios.CancelToken.source();

  resetPosts = async () => {
    this.setState({ ...INITIAL_STATE }, async () => {
      await this.fetchPosts();
    });
  };

  componentDidMount = async () => {
    this._unsubscribeFocus = this.props.navigation.addListener("focus", () => {
      this.playViewableVideo();
      if (this.props.route?.params?.type === "update") {
        // Update selected post
        const { updatedPost } = this.props.route?.params;
        const post = this.state.posts.find((obj) => obj.id == updatedPost.id);

        let newPost = {
          ...post,
          title: updatedPost.title,
          game: updatedPost.game,
          tags: updatedPost.tags,
        };
        this.setState((prevState) => {
          return {
            posts: prevState.posts.map((item) =>
              item.id === newPost.id ? newPost : item
            ),
          };
        });
      }
    });
    this._unsubscribeBlur = this.props.navigation.addListener(
      "blur",
      this.pauseViewableVideo
    );
    await this.fetchPosts();
  };

  componentDidUpdate = async (prevProps) => {
    if (
      prevProps.feedType !== this.props.feedType ||
      prevProps.game_id !== this.props.game_id
    ) {
      // Reset state
      await this.resetPosts();
    }
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
      const { posts, upload } = response.data.payload;

      const clipsWithRef = posts.map((post) => ({
        ...post,
        positionMillis: 0,
        videoRef: React.createRef(),
      }));

      this.setState((prevState) => ({
        initLoaded: true,
        isLoading: false,
        posts: [...prevState.posts, ...clipsWithRef],
        is_upload: upload,
        endReached: posts.length < this.fetchCount,
      }));
    };

    const APIKit = await createAPIKit();
    const dateNow = new Date();
    let url = undefined;
    let postData = undefined;
    if (this.props.type === "Feed") {
      if (this.props.feedType === 1) url = "feed/posts/world/";
      else url = "/feed/posts/following/";
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

    if (typeof this.props.game_id == "string") {
      postData = { ...postData, game_id: this.props.game_id };
    }

    APIKit.post(url, postData, { cancelToken: this.cancelTokenSource.token })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  setSelectedPost = (post) => {
    const callback = () => {
      this.state.selectedPost.is_repost
        ? this.RBSheetOther.open() // Report or Delete
        : this.state.selectedPost.posted_by.username ===
          this.context.user.username
        ? this.RBSheetSelf.open() // Edit, Delete
        : this.RBSheetOther.open(); // Report
    };
    this.setState({ selectedPost: post }, callback);
  };

  repostPost = (post) => {
    this.setState({ selectedPost: post, showRepostOverlay: true });
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

    return (
      <Post
        type={this.props.type}
        post={item}
        hToWRatio={item.clip.height / item.clip.width}
        // REPOST_HEIGHT={REPOST_HEIGHT}
        // TITLE_HEIGHT={TITLE_HEIGHT}
        // VIDEO_HEIGHT={video_height}
        // FOOTER_HEIGHT={FOOTER_HEIGHT}
        // MARGIN={ITEM_MARGIN}
        dateDiff={dateDiff}
        navigateProfile={this.navigateProfile}
        setSelectedPost={this.setSelectedPost}
        repostPost={this.repostPost}
        onViewedClip={this.onViewedClip}
        play={this.state.play}
        mute={this.state.mute}
        toggleTagsOverlay={this.toggleTags}
        togglePlay={this.togglePlay}
        toggleMute={this.toggleMute}
        toggleLike={this.toggleLike}
        username={this.context.user.username}
      />
    );
  };

  keyExtractor = (post) => {
    return post.id;
  };

  // getItemLayout = (data, index) => {
  //   const video_height = getVideoHeight(
  //     data[index].clip.height,
  //     data[index].clip.width
  //   );

  //   let item_height = video_height + TITLE_HEIGHT + FOOTER_HEIGHT;
  //   if (data[index].is_repost == true) item_height += REPOST_HEIGHT;
  //   return {
  //     length: item_height,
  //     // TODO how to calculate offset value when items have different heights
  //     // The below formula doesn't work
  //     offset: (item_height + ITEM_MARGIN) * index,
  //     index,
  //   };
  // };

  navigateProfile = async (username) => {
    await this.unmountViewableVideo();
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "Profile", params: { username } }],
    });

    this.props.navigation.dispatch(resetAction);
  };

  toggleTags = (post) => {
    this.setState({ selectedPost: post, showTagsOverlay: true });
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

  hideTagsOverlay = () => {
    this.setState({ selectedPost: null, showTagsOverlay: false });
  };

  hideDeleteOverlay = () => {
    this.setState({
      selectedPost: null,
      showDeleteOverlay: false,
    });
  };

  hideReportOverlay = () => {
    this.setState({
      selectedPost: null,
      showReportOverlay: false,
    });
  };

  hideRepostOverlay = () => {
    this.setState({
      selectedPost: null,
      showRepostOverlay: false,
    });
  };

  unloadClip = async (item) => {
    if (item?.videoRef?.current == undefined) return;
    const status = await item.videoRef.current.getStatusAsync();
    const positionMillis = status.positionMillis;
    item?.videoRef?.current && (await item.videoRef.current.unloadAsync());
    if (typeof positionMillis != "number") return;
    let newPost = {
      ...item,
      positionMillis: positionMillis,
    };
    this.setState((prevState) => {
      return {
        posts: prevState.posts.map((item) =>
          item.id === newPost.id ? newPost : item
        ),
      };
    });
  };

  onViewableItemsChanged = async ({ viewableItems, changed }) => {
    // Unload changed but not viewable
    for (const changedItem of changed) {
      if (changedItem.isViewable === false) {
        console.log("Unloading", changedItem.index);
        await this.unloadClip(changedItem.item);
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
        {
          shouldPlay: this.state.play,
          isMuted: this.state.mute,
          positionMillis: currentViewable.item?.positionMillis || 0,
        }
      );
      this.setState({ viewable: currentViewable.item });
    };

    if (viewableItems.length > 0) {
      const viewable = viewableItems[0];
      if (this.state.viewable === null || this.state.viewable === undefined) {
        await loadCurrentViewable(viewable);
      } else if (viewable.item?.id !== this.state.viewable?.item?.id) {
        await this.unloadClip(this.state.viewable);
        await loadCurrentViewable(viewable);
      }
    }
  };

  render = () =>
    this.state.initLoaded ? (
      <View style={styles.container}>
        {this.state.posts.length > 0 ? (
          <FlatList
            decelerationRate={0.5}
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
            ListHeaderComponent={this.props.renderHeader}
            stickyHeaderIndices={[0]}
            // Optimizations
            maxToRenderPerBatch={10}
            // getItemLayout={this.getItemLayout}
            // View controls
            onViewableItemsChanged={this.onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 80,
            }}
          />
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {typeof this.props.renderHeader == "function" &&
              this.props.renderHeader()}
            <LottieView
              autoPlay
              style={{
                width: 0.5 * screenWidth,
                height: 0.5 * screenWidth,
              }}
              source={require("../../../assets/9844-loading-40-paperplane.json")}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Upload");
              }}
              style={styles.button}
            >
              <Ionicons
                style={styles.icon}
                name="cloud-upload-outline"
                size={ICON_SIZE}
                color={darkTheme.on_background}
              />
              <Text style={styles.buttonText}>Upload a Clip</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.showTagsOverlay && (
          <TagsOverlay
            post={this.state.selectedPost}
            showOverlay={this.state.showTagsOverlay}
            hideTagsOverlay={this.hideTagsOverlay}
          />
        )}
        {this.state.showReportOverlay && (
          <ReportOverlay
            post_id={this.state.selectedPost.id}
            hideReportOverlay={this.hideReportOverlay}
          />
        )}
        {this.state.showDeleteOverlay && (
          <DeleteOverlay
            post={this.state.selectedPost}
            showOverlay={this.state.showDeleteOverlay}
            hideDeleteOverlay={this.hideDeleteOverlay}
            deletePostFromList={this.deletePostFromList}
          />
        )}
        {this.state.showRepostOverlay && (
          <RepostOverlay
            post={this.state.selectedPost}
            showOverlay={this.state.showRepostOverlay}
            hideRepostOverlay={this.hideRepostOverlay}
          />
        )}

        <RBSheet
          ref={(ref) => {
            this.RBSheetSelf = ref;
          }}
          animationType="slide"
          closeOnDragDown
          height={
            SHEET_ICON_SIZE + 3 * SHEET_ITEM_MARGIN + 2 * SHEET_ITEM_HEIGHT
          }
          customStyles={{
            container: styles.sheetContainer,
          }}
        >
          <>
            {this.state.selectedPost?.is_repost === false && (
              <TouchableOpacity
                style={styles.sheetTouchable}
                onPress={() => {
                  this.RBSheetSelf.close();
                  this.props.navigation.navigate("Edit Post", {
                    post: {
                      id: this.state.selectedPost.id,
                      title: this.state.selectedPost.title,
                      game: this.state.selectedPost.game,
                      tags: this.state.selectedPost.tags,
                    },
                    routeName: this.props.route.name,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name={"circle-edit-outline"}
                  size={SHEET_ICON_SIZE}
                  color={SHEET_ICON_COLOR}
                  style={styles.sheetIcon}
                />
                <Text style={styles.sheetText}>Edit Post</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.sheetTouchable}
              onPress={() => {
                this.setState({ showDeleteOverlay: true });
                this.RBSheetSelf.close();
              }}
            >
              <Ionicons
                name={"trash-outline"}
                size={SHEET_ICON_SIZE}
                color={SHEET_ICON_COLOR}
                style={styles.sheetIcon}
              />
              <Text style={styles.sheetText}>Delete Post</Text>
            </TouchableOpacity>
          </>
        </RBSheet>

        <RBSheet
          ref={(ref) => {
            this.RBSheetOther = ref;
          }}
          animationType="slide"
          closeOnDragDown
          height={SHEET_ICON_SIZE + 2 * SHEET_ITEM_MARGIN + SHEET_ITEM_HEIGHT}
          customStyles={{
            container: styles.sheetContainer,
          }}
        >
          {this.state.selectedPost?.is_repost === true &&
          this.state.selectedPost?.reposted_by?.username ===
            this.context.user.username ? (
            <TouchableOpacity
              style={styles.sheetTouchable}
              onPress={() => {
                this.setState({ showDeleteOverlay: true });
                this.RBSheetOther.close();
              }}
            >
              <Ionicons
                name={"trash-outline"}
                size={SHEET_ICON_SIZE}
                color={SHEET_ICON_COLOR}
                style={styles.sheetIcon}
              />
              <Text style={styles.sheetText}>Delete Repost</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sheetTouchable}
              onPress={() => {
                this.setState({ showReportOverlay: true });
                this.RBSheetOther.close();
              }}
            >
              <Ionicons
                name={"flag-outline"}
                size={SHEET_ICON_SIZE}
                color={SHEET_ICON_COLOR}
                style={styles.sheetIcon}
              />
              <Text style={styles.sheetText}>Report Post</Text>
            </TouchableOpacity>
          )}
        </RBSheet>
      </View>
    ) : (
      <View style={styles.lottieParent}>
        <LottieView
          style={styles.lottie}
          autoPlay
          source={require("../../../assets/1049-hourglass.json")}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  lottie: {
    width: 0.9 * screenWidth,
    height: 0.9 * screenWidth,
  },
  lottieParent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: darkTheme.on_background,
  },
  icon: { marginRight: 8 },
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
  sheetContainer: {
    backgroundColor: darkTheme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  sheetTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SHEET_ITEM_MARGIN,
  },
  sheetIcon: { marginRight: 15 },
  sheetText: {
    fontSize: SHEET_ICON_SIZE - 5,
    color: darkTheme.on_surface_title,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
});

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route.name);
  return <Posts {...props} navigation={navigation} route={route} />;
}
