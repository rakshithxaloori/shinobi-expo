import React, { Component } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

import { createAPIKit } from "../../../utils/APIKit";
import { flashAlert } from "../../../utils/flash_message";
import { dateTimeDiff, handleAPIError } from "../../../utils";
import { darkTheme } from "../../../utils/theme";
import FeedClip from "./feedClip";

const ITEM_HEIGHT = 250;
const ITEM_MARGIN = 10;

class ClipsFeed extends Component {
  state = {
    clips: [],
    initLoaded: false,
    isLoading: true,
    isRefreshing: false,
    endReached: false,
  };

  fetchCount = 2;
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchClips();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchClips = async () => {
    console.log("FETCH CLIPS");
    if (this.state.endReached) return;
    const onSuccess = (response) => {
      const { clips } = response.data.payload;
      console.log(clips.length !== this.fetchCount);
      this.setState((prevState) => ({
        initLoaded: true,
        isLoading: false,
        clips: [...prevState.clips, ...clips],
        endReached: clips.length !== this.fetchCount,
      }));
    };

    const APIKit = await createAPIKit();
    let datetime = undefined;
    if (this.state.clips.length === 0) datetime = new Date();
    else
      datetime = this.state.clips[this.state.clips.length - 1].created_datetime;

    APIKit.post(
      `/clips/clips/`,
      { datetime: datetime },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  renderClip = ({ item }) => {
    const dateThen = new Date(item.created_datetime);
    const dateDiff = dateTimeDiff(dateThen);
    return (
      <FeedClip
        clip={item}
        HEIGHT={ITEM_HEIGHT}
        MARGIN={ITEM_MARGIN}
        dateDiff={dateDiff}
        navigateProfile={this.navigateProfile}
      />
    );
  };

  keyExtractor = (clip) => {
    return clip.id;
  };

  getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + ITEM_MARGIN) * index,
    index,
  });

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", { username });
  };

  render = () =>
    this.state.initLoaded ? (
      <View>
        <FlatList
          contentContainerStyle={styles.container}
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
      <View>{/*PLACEHOLDERS*/}</View>
    );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, paddingHorizontal: 5 },
});

export default ClipsFeed;
