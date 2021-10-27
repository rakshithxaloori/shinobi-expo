import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Divider } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Notification from "./notification";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";

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
        const { notifications } = response.data?.payload;
        this.setState((prevState) => ({
          initialLoading: false,
          notifications: [...prevState.notifications, ...notifications],
          endReached: notifications.length !== this.fetchCount,
          isLoading: false,
        }));
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

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", { username });
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
          />
          <ShimmerPlaceHolder
            width={80}
            shimmerStyle={{ marginLeft: 10, borderRadius: 10 }}
          />
        </View>
      );
    }

    return placeholders;
  };

  renderSeperator = () => (
    <Divider
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 5,
      }}
      insetType="middle"
      orientation="horizontal"
    />
  );

  renderNotification = (notification) => (
    <Notification
      avatarSize={this.avatarSize}
      notification={notification}
      navigateProfile={this.navigateProfile}
    />
  );

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
    <SafeAreaView style={styles.container}>
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
          // ItemSeparatorComponent={this.renderSeperator}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color={darkTheme.on_background}
            />
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>
            Wow, such empty
          </Text>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 10,
  },
});

export default Notifications;
