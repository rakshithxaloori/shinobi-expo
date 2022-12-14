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

import ChatPreview from "./chatPreview";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { lightTheme } from "../../utils/theme";

const screenWidth = Dimensions.get("screen").width;

class AllChats extends Component {
  state = {
    initialLoading: true,
    chat_users: [],
    isLoading: false,
    count: undefined,
    endReached: false,
    error: "",
  };

  fetchCount = 10;
  avatarSize = 55;
  cancelTokenSource = axios.CancelToken.source();

  fetchChats = async () => {
    if (!this.state.endReached) {
      this.setState({ isLoading: this.state.count !== undefined });

      const onSuccess = (response) => {
        const { chat_users } = response.data?.payload;
        const count = chat_users.length;
        this.setState((prevState) => ({
          initialLoading: false,
          chat_users: [...prevState.chat_users, ...chat_users],
          count: prevState.count ? prevState.count + count : count,
          endReached: count !== this.fetchCount,
          isLoading: false,
        }));
      };

      const APIKit = await createAPIKit();
      APIKit.get(
        `/chat/${this.state.count === undefined ? 0 : this.state.count}/${
          this.state.count === undefined
            ? this.fetchCount
            : this.state.count + this.fetchCount
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

  render = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.info}>
        You can only chat with people who follow you and who you follow back
      </Text>
      {this.state.initialLoading ? (
        <View style={styles.container}>{this.renderPlaceholders()}</View>
      ) : this.state.count > 0 ? (
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.chat_users}
          renderItem={this.renderChat}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchChats}
          onEndReachedThreshold={5}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeperator}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color="#000000"
            />
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>
            Wow, such empty :(
          </Text>
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
    color: "#b8bec3",
    fontWeight: "600",
  },
  placeholder: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    padding: 10,
  },
});

export default AllChats;
