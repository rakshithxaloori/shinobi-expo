import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { createAPIKit } from "../../../utils/APIKit";
import { flashAlert } from "../../../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";
import Clip from "./clip";
import DeleteOverlay from "./overlay";
import AuthContext from "../../../authContext";
import { shimmerColors } from "../../../utils/styles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const VIDEO_WIDTH = screenWidth - 20;
const TITLE_HEIGHT = 60;
const FOOTER_HEIGHT = 80;
const ITEM_MARGIN = 10;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const getVideoHeight = (video_height) => {
  const min_height = Math.min(VIDEO_WIDTH * video_height, screenHeight - 300);
  return min_height;
};

class ClipsFeed extends Component {
  static contextType = AuthContext;
  state = {
    clips: [],
    viewable: null,
    mute: true,
    initLoaded: false,
    isLoading: true,
    endReached: false,
    deleteClip: undefined,
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
    await this.fetchClips();
  };

  unmountAllVideos = async () => {
    this.state.viewable.current &&
      (await this.state.viewable.current.unloadAsync());
  };

  componentWillUnmount = async () => {
    await this.unmountAllVideos();
    this.cancelTokenSource.cancel();
  };

  deleteItemById = (id) => {
    const filteredData = this.state.clips.filter((item) => item.id !== id);
    this.setState({ clips: filteredData });
  };

  fetchClips = async () => {
    if (this.state.endReached) return;
    const onSuccess = (response) => {
      const { clips } = response.data.payload;
      const clipsWithRef = clips.map((clip) => ({
        ...clip,
        videoRef: React.createRef(),
      }));

      this.setState((prevState) => ({
        initLoaded: true,
        isLoading: false,
        clips: [...prevState.clips, ...clipsWithRef],
        endReached: clips.length < this.fetchCount,
      }));
    };

    const APIKit = await createAPIKit();
    const dateNow = new Date();
    APIKit.post(
      `/clips/clips/profile/`,
      {
        username: this.props.username,
        datetime:
          this.state.clips[this.state.clips.length - 1]?.created_datetime ||
          dateNow,
      },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  toggleOverlay = () => {
    console.log("TOGGLING");
    this.setState((prevState) => ({
      showDeleteOverlay: !prevState.showDeleteOverlay,
    }));
  };

  setDeleteClip = (clip_id) => {
    this.setState({ deleteClip: clip_id, showDeleteOverlay: true });
  };

  renderClip = ({ item }) => {
    const dateThen = new Date(item.created_datetime);
    const dateDiff = dateTimeDiff(dateThen);

    const video_height = getVideoHeight(item.height_to_width_ratio);

    return (
      <Clip
        username={this.props.username}
        clip={item}
        TITLE_HEIGHT={TITLE_HEIGHT}
        VIDEO_HEIGHT={video_height}
        FOOTER_HEIGHT={FOOTER_HEIGHT}
        MARGIN={ITEM_MARGIN}
        dateDiff={dateDiff}
        setDeleteClip={this.setDeleteClip}
        toggleOverlay={this.toggleOverlay}
        mute={this.state.mute}
        toggleMute={this.toggleMute}
        // TODO toggleLike={}
      />
    );
  };

  keyExtractor = (clip) => {
    return clip.id;
  };

  getItemLayout = (data, index) => {
    const video_height = getVideoHeight(data[index].height_to_width_ratio);

    const item_height = video_height + TITLE_HEIGHT + FOOTER_HEIGHT;
    return {
      length: item_height,
      offset: (item_height + ITEM_MARGIN) * index,
      index,
    };
  };

  toggleMute = () => {
    this.setState((prevState) => ({ mute: !prevState.mute }));
  };

  onViewableItemsChanged = async ({ viewableItems, changed }) => {
    // Unload changed but not viewable
    for (const changedItem of changed) {
      if (!changedItem.isViewable) {
        console.log("Unloading", changedItem.index);
        const { item } = changedItem;
        await item.videoRef.current.unloadAsync();
      }
    }

    // Load the first viewable
    const loadCurrentViewable = async (currentViewable) => {
      console.log("Loading", currentViewable.index);
      await currentViewable.item.videoRef.current.loadAsync(
        { uri: currentViewable.item.url },
        { shouldPlay: true, isLooping: true, isMuted: this.state.mute }
      );
      this.setState({ viewable: currentViewable.item });
    };

    if (viewableItems.length > 0) {
      const viewable = viewableItems[0];

      if (this.state.viewable === null) {
        await loadCurrentViewable(viewable);
      } else if (viewable != this.state.viewable) {
        await this.state.viewable.videoRef.current.unloadAsync();
        await loadCurrentViewable(viewable);
      }
    }
  };

  render = () =>
    this.state.initLoaded ? (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          data={this.state.clips}
          onEndReached={this.fetchClips}
          onEndReachedThreshold={1}
          renderItem={this.renderClip}
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
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
          }}
        />
        {this.state.showDeleteOverlay && (
          <DeleteOverlay
            clip_id={this.state.deleteClip}
            showOverlay={this.state.showDeleteOverlay}
            toggleOverlay={this.toggleOverlay}
            deleteItemById={this.deleteItemById}
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
    marginTop: 10,
  },
});

export default ClipsFeed;
