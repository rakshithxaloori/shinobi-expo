import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Divider } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import ChatPreview from "../components/chat/chatPreview";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";
import { shimmerColors } from "../utils/styles";

const screenWidth = Dimensions.get("screen").width;

class AllChats extends Component {
  state = {
    initialLoading: true,
    chat_users: [],
    isLoading: false,
    isRefreshing: false,
    endReached: false,
    error: "",
  };

  fetchCount = 10;
  avatarSize = 55;
  cancelTokenSource = axios.CancelToken.source();

  fetchChats = async () => {
    if (!this.state.endReached) {
      this.setState({ isLoading: this.state.chat_users.length > 0 });

      const onSuccess = (response) => {
        const { chat_users } = response.data?.payload;
        this.setState((prevState) => ({
          initialLoading: false,
          chat_users: [...prevState.chat_users, ...chat_users],
          endReached: chat_users.length !== this.fetchCount,
          isLoading: false,
          isRefreshing: false,
        }));
      };

      const APIKit = await createAPIKit();
      APIKit.get(
        `/chat/${
          this.state.chat_users.length === 0 ? 0 : this.state.chat_users.length
        }/${
          this.state.chat_users.length === 0
            ? this.fetchCount
            : this.state.chat_users.length + this.fetchCount
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
    await this.fetchChats();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  renderPlaceholders = () => {
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

  navigateChat = (chatId, user) => {
    this.props.navigation.navigate("Chat", {
      chatId,
      user,
    });
  };

  renderChat = ({ item }) => {
    return (
      <ChatPreview
        chat={item.chat}
        last_read={item.last_read}
        navigateChat={this.navigateChat}
        avatarSize={this.avatarSize}
      />
    );
  };

  keyExtractor = ({ chat }) => chat.id.toString();

  renderSeperator = () => (
    <Divider
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 40,
        marginVertical: 10,
      }}
      insetType="middle"
      orientation="horizontal"
    />
  );

  refreshChats = () => {
    this.setState(
      {
        initialLoading: true,
        chat_users: [],
        isLoading: false,
        isRefreshing: true,
        endReached: false,
        error: "",
      },
      async () => {
        await this.fetchChats();
      }
    );
  };

  render = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.info}>
        You can only chat with people who follow you and who you follow back
      </Text>
      {this.state.initialLoading ? (
        <View style={styles.container}>{this.renderPlaceholders()}</View>
      ) : this.state.chat_users.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.chat_users}
          renderItem={this.renderChat}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchChats}
          onEndReachedThreshold={5}
          onRefresh={this.refreshChats}
          refreshing={this.state.isRefreshing}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeperator}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color={darkTheme.on_background}
            />
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Wow, such empty</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  info: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 20,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "600",
  },
  placeholder: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
  },
  emptyText: {
    fontWeight: "600",
    fontSize: 18,
    color: darkTheme.on_background,
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    padding: 10,
  },
});

export default AllChats;
