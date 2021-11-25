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
import FeedClip from "./feedClip";
import ReportOverlay from "./overlay";

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
  state = {
    clips: [],
    viewable: [],
    mute: true,
    initLoaded: false,
    isLoading: true,
    endReached: false,
    reportClipId: undefined,
  };

  fetchCount = 10;
  cancelTokenSource = axios.CancelToken.source();

  placeholder = (
    <View style={{ marginBottom: 20, alignItems: "center" }}>
      <ShimmerPlaceHolder
        width={screenWidth - 20}
        height={250}
        shimmerStyle={{
          borderRadius: 10,
        }}
        shimmerColors={[darkTheme.surface, "#c5c5c5", darkTheme.surface]}
      />
    </View>
  );

  componentDidMount = async () => {
    await this.fetchClips();
  };

  componentWillUnmount = async () => {
    for (const videoRef of this.state.viewable) {
      videoRef.current && (await videoRef.current.unloadAsync());
    }
    this.cancelTokenSource.cancel();
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
      `/clips/clips/all/`,
      {
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

  reportClip = (clip_id) => {
    this.setState({ reportClipId: clip_id });
  };

  clearReport = () => {
    this.setState({ reportClipId: undefined });
  };

  renderClip = ({ item }) => {
    const dateThen = new Date(item.created_datetime);
    const dateDiff = dateTimeDiff(dateThen);

    const video_height = getVideoHeight(item.height_to_width_ratio);

    return (
      <FeedClip
        clip={item}
        TITLE_HEIGHT={TITLE_HEIGHT}
        VIDEO_HEIGHT={video_height}
        FOOTER_HEIGHT={FOOTER_HEIGHT}
        MARGIN={ITEM_MARGIN}
        dateDiff={dateDiff}
        navigateProfile={this.navigateProfile}
        reportClip={this.reportClip}
        mute={this.state.mute}
        toggleMute={this.toggleMute}
        toggleLike={this.toggleLike}
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

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", { username });
  };

  toggleMute = () => {
    this.setState((prevState) => ({ mute: !prevState.mute }));
  };

  toggleLike = async (clip) => {
    console.log("toggleLike", clip.id);
    const onSuccess = () => {
      let newClip = {
        ...clip,
        me_like: !clip.me_like,
        likes: clip.me_like ? clip.likes - 1 : clip.likes + 1,
      };
      this.setState((prevState) => {
        return {
          clips: prevState.clips.map((item) =>
            item.id === newClip.id ? newClip : item
          ),
        };
      });
    };

    const APIKit = await createAPIKit();
    let url = null;
    if (clip.me_like) url = "clips/unlike/";
    else url = "clips/like/";
    APIKit.post(
      url,
      { clip_id: clip.id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  onViewableItemsChanged = async ({ viewableItems, changed }) => {
    this.setState({ viewable: [] });
    for (const viewable of changed) {
      if (viewable.isViewable) {
        console.log("Loading", viewable.index);
        const { item } = viewable;

        await item.videoRef.current.loadAsync(
          { uri: item.url },
          { shouldPlay: true, isLooping: true, isMuted: this.state.mute }
        );
        this.setState((prevState) => ({
          viewable: [...prevState.viewable, item.videoRef],
        }));
      } else {
        console.log("Unloading", viewable.index);
        const { item } = viewable;
        await item.videoRef.current.unloadAsync();
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
        {this.state.reportClipId && (
          <ReportOverlay
            clip_id={this.state.reportClipId}
            clearReport={this.clearReport}
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
    paddingHorizontal: 5,
  },
});

export default ClipsFeed;
