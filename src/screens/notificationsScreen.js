import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";
import LottieView from "lottie-react-native";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Notification from "../components/notifications/notification";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";
import { shimmerColors } from "../utils/styles";
import VirtualizedList from "../utils/virtualizedList";
import { DEEP_LINK_TYPES } from "../utils/share";

const screenWidth = Dimensions.get("screen").width;

class Notifications extends Component {
  state = {
    initialLoading: true,
    endReached: false,
    notifications: [],
    isLoading: false,
    isRefreshing: false,
    error: "",
  };

  fetchCount = 15;
  avatarSize = 33;
  cancelTokenSource = axios.CancelToken.source();

  fetchNotifications = async () => {
    if (!this.state.endReached) {
      this.setState({ isLoading: this.state.notifications.length === 0 });

      const onSuccess = (response) => {
        const callback = () => {
          if (this.state.notifications.length === 0) {
            this.profileAnimation.play();
          }
        };

        const { notifications } = response.data?.payload;
        this.setState(
          (prevState) => ({
            initialLoading: false,
            notifications: [...prevState.notifications, ...notifications],
            endReached: notifications.length !== this.fetchCount,
            isLoading: false,
          }),
          callback
        );
      };

      const APIKit = await createAPIKit();
      APIKit.get(
        `/notification/${this.state.notifications.length}/${
          this.state.notifications.length + this.fetchCount
        }/`,
        { cancelToken: this.cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          this.setState({
            isLoading: false,
            error: handleAPIError(e),
          });
        });
    }
  };

  componentDidMount = async () => {
    await this.fetchNotifications();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  placeholders = () => {
    const placeholders = [];
    for (let i = 0; i < 5; i++) {
      placeholders.push(
        <View key={i} style={styles.placeholder}>
          <ShimmerPlaceHolder
            width={this.avatarSize}
            height={this.avatarSize}
            shimmerStyle={{ borderRadius: this.avatarSize / 2 }}
            shimmerColors={shimmerColors}
          />
          <ShimmerPlaceHolder
            width={80}
            shimmerStyle={{ marginLeft: 10, borderRadius: 10 }}
            shimmerColors={shimmerColors}
          />
        </View>
      );
    }

    return placeholders;
  };

  onNotificationPress = (sender, type, extra_data) => {
    const { navigation } = this.props;
    const username = sender.username;
    const post_id = extra_data?.post_id;

    switch (type) {
      case DEEP_LINK_TYPES.FOLLOW:
        navigation.navigate("Profile", { username });
        break;

      case DEEP_LINK_TYPES.LIKE:
        navigation.navigate("Profile", { username });
        break;

      case DEEP_LINK_TYPES.TAG:
        if (typeof post_id === "string")
          navigation.navigate("Clip", { post_id });
        else navigation.navigate("Profile", { username });
        break;

      case DEEP_LINK_TYPES.REPOST:
        // Redirect to Profile or Clip?
        navigation.navigate("Profile", { username });
        break;

      case DEEP_LINK_TYPES.CLIP:
        if (typeof post_id === "string")
          navigation.navigate("Clip", { post_id });
        else navigation.navigate("Profile", { username });
        break;
    }
  };

  renderNotification = (notification) => {
    const { type } = notification.item;

    let textString = "";
    switch (type) {
      case DEEP_LINK_TYPES.FOLLOW:
        textString = "follows you";
        break;

      case DEEP_LINK_TYPES.LIKE:
        textString = "liked your clip";
        break;

      case DEEP_LINK_TYPES.TAG:
        textString = "tagged you in a clip";
        break;

      case DEEP_LINK_TYPES.REPOST:
        textString = "reposted your clip";
        break;

      case DEEP_LINK_TYPES.CLIP:
        textString = "uploaded a clip";
        break;
    }

    if (textString == "") return null;

    return (
      <Notification
        avatarSize={this.avatarSize}
        notification={notification}
        textString={textString}
        onPress={this.onNotificationPress}
      />
    );
  };

  keyExtractor = (notification) => notification.id.toString();

  refresh = async () => {
    const callback = () => {
      this.fetchNotifications().then(() => {
        this.setState({
          isRefreshing: false,
        });
      });
    };

    this.setState(
      {
        initialLoading: true,
        endReached: false,
        notifications: [],
        isLoading: false,
        isRefreshing: true,
        error: "",
      },
      callback
    );
  };

  render = () => (
    <VirtualizedList style={styles.container}>
      {this.state.initialLoading ? (
        <View style={styles.container}>{this.placeholders()}</View>
      ) : this.state.notifications.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.notifications}
          refreshing={this.state.isRefreshing}
          onRefresh={this.refresh}
          renderItem={this.renderNotification}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchNotifications}
          onEndReachedThreshold={5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color={darkTheme.on_background}
            />
          }
        />
      ) : (
        <View style={styles.empty}>
          <LottieView
            ref={(animation) => {
              this.profileAnimation = animation;
            }}
            style={{
              width: 0.9 * screenWidth,
              height: 0.9 * screenWidth,
            }}
            source={require("../../assets/51382-astronaut-light-theme.json")}
          />
        </View>
      )}
    </VirtualizedList>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default Notifications;
