import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { createAPIKit } from "../../../utils/APIKit";
import { flashAlert } from "../../../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";
import FeedClip from "./feedClip";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const VIDEO_WIDTH = screenWidth - 20;
const TITLE_HEIGHT = 60;
const ITEM_MARGIN = 10;

const REFRESH_TEXT_SIZE = 15;
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const minOf = (var1, var2) => {
  if (var1 > var2) return var2;
  else return var1;
};

class ClipsFeed extends Component {
  state = {
    clips: [],
    initLoaded: false,
    isLoading: true,
    refresh: false,
    isRefreshing: false,
    endReached: false,
  };

  fetchCount = 2;
  cancelTokenSource = axios.CancelToken.source();
  stickyHeader = (
    <TouchableOpacity style={styles.refresh} onPress={this.refresh}>
      <Ionicons
        name="planet-outline"
        color={darkTheme.on_secondary}
        size={REFRESH_TEXT_SIZE}
      />
      <Text style={styles.refreshText}>New Clips</Text>
    </TouchableOpacity>
  );
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

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchClips = async () => {
    if (this.state.endReached) return;
    const onSuccess = (response) => {
      const { clips, refresh } = response.data.payload;
      this.setState((prevState) => ({
        initLoaded: true,
        isLoading: false,
        refresh: refresh,
        clips: [...prevState.clips, ...clips],
        endReached: clips.length !== this.fetchCount,
      }));
    };

    const APIKit = await createAPIKit();
    let id = 0;
    if (this.state.clips.length !== 0)
      id = this.state.clips[this.state.clips.length - 1].id;

    APIKit.post(
      `/clips/clips/`,
      { id: id, id_top: this.state.clips[0]?.id || 0 },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  refresh = async () => {
    const callback = async () => {
      await this.fetchClips();
    };

    this.setState(
      {
        clips: [],
        initLoaded: false,
        isLoading: true,
        refresh: false,
        isRefreshing: true,
        endReached: false,
      },
      callback
    );
  };

  renderClip = ({ item }) => {
    const dateThen = new Date(item.created_datetime);
    const dateDiff = dateTimeDiff(dateThen);

    const video_height = minOf(
      VIDEO_WIDTH * item.height_to_width_ratio,
      screenHeight - 200
    );
    return (
      <FeedClip
        clip={item}
        TITLE_HEIGHT={TITLE_HEIGHT}
        VIDEO_HEIGHT={video_height}
        MARGIN={ITEM_MARGIN}
        dateDiff={dateDiff}
        navigateProfile={this.navigateProfile}
      />
    );
  };

  keyExtractor = (clip) => {
    return clip.id;
  };

  getItemLayout = (data, index) => {
    const video_height = minOf(
      VIDEO_WIDTH * data[index].height_to_width_ratio,
      screenHeight - 100
    );

    const item_height = video_height + TITLE_HEIGHT;
    return {
      length: item_height,
      offset: (item_height + ITEM_MARGIN) * index,
      index,
    };
  };

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", { username });
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
        />
      </View>
    ) : (
      <View style={styles.container}>
        {this.placeholder}
        {this.placeholder}
      </View>
    );
}

const styles = StyleSheet.create({
  refreshText: {
    paddingLeft: 5,
    fontSize: REFRESH_TEXT_SIZE,
    fontWeight: "bold",
  },
  refresh: {
    flexDirection: "row",
    height: 40,
    width: 110,
    borderRadius: 20,
    backgroundColor: darkTheme.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  list: {
    // zIndex: 0,
    // elevation: 0,
  },
  container: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
});

export default ClipsFeed;
