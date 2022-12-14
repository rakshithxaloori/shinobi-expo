import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

import { createAPIKit } from "../../utils/APIKit";
import { createWSKit } from "./WSKit";
import { create_UUID, handleAPIError } from "../../utils";
import AuthContext from "../../authContext";

const messageCount = 25;
const configureMessage = (message, my_username) => ({
  _id: create_UUID(),
  text: message.text,
  createdAt: message.sent_at,
  user:
    my_username === message.sent_by.username
      ? {}
      : {
          _id: create_UUID(),
          name: message.sent_by.username,
          avatar: message.sent_by.picture,
        },
});

class Chat extends Component {
  static contextType = AuthContext;

  state = {
    chatLoaded: false,
    chatClosed: false,
    messages: [],
    earlierLoading: false,
    endReached: false,
    error: "",
  };

  count = 0;
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const { chatId, user } = this.props.route.params;

    this.props.navigation.setOptions({ headerTitle: user.username });

    const chatSocket = await createWSKit(chatId);

    chatSocket.onmessage = (msg) => {
      this.onMessage(msg);
    };
    chatSocket.onerror = (error) => {
      this.onError(error);
    };
    chatSocket.onclose = (close) => {
      this.onClose(close);
    };

    this.sendOneMessage = (message) => {
      chatSocket.send(
        JSON.stringify({
          message: message,
        })
      );
    };
    this.closeSocket = () => chatSocket.close(1000);

    const onSuccess = (response) => {
      console.log(response.data);
      const messages = response.data.payload.messages.map((message) =>
        configureMessage(message, this.context.user.username)
      );

      this.setState({
        chatLoaded: true,
        endReached: messages.length < messageCount,
        messages: messages,
      });
      this.count = messages.length;
    };

    const APIKit = await createAPIKit();
    APIKit.get(
      `/chat/messages/${this.props.route.params.chatId}/0/${messageCount}/`,
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        this.setState({ error: handleAPIError(e) });
      });
  };

  componentWillUnmount = async () => {
    this.closeSocket();
    const { chatId } = this.props.route.params;
    this.cancelTokenSource.cancel();
    const APIKit = await createAPIKit();
    APIKit.post("/chat/read/", { chat_id: chatId }).catch((e) => {
      console.log(e);
    });
  };

  onMessage = async (message) => {
    const newMessage = configureMessage(
      JSON.parse(message.data),
      this.context.user.username
    );

    this.setState((prevState) => {
      const newMessages = [newMessage, ...prevState.messages];
      this.count += 1;
      return {
        messages: newMessages,
      };
    });
  };

  onError = (error) => {
    console.log(error);
  };

  onClose = (close) => {
    if (close.code === 4200) {
      // Chat deleted cause you got unfollowed
      // Happens when you send a text to person who just unfollowed you
      this.setState({ error: "Chat closed" });
      // TODO redirect to chat/index and show that chat has been closed
      Alert.alert(
        `${this.props.route.params.user.username} unfollowed you`,
        `You can't send texts to ${this.props.route.params.user.username}`
      );
      this.setState({ chatClosed: true });
    }
  };

  sendMessages = (messages = []) => {
    if (this.state.chatClosed) {
      Alert.alert(
        `${this.props.route.params.user.username} unfollowed you`,
        `You can't send texts to ${this.props.route.params.user.username}`
      );
    } else {
      messages.map((message) => {
        this.sendOneMessage(message.text);
      });
    }
  };

  loadEarlierMessages = async () => {
    if (!this.state.endReached) {
      this.setState({ earlierLoading: true });
      const onSuccess = (response) => {
        if (response.data.payload.messages) {
          const messages = response.data.payload.messages?.map((message) =>
            configureMessage(message, this.context.user.username)
          );
          this.count += messages.length;
          this.setState((prevState) => {
            const newMessages = [...prevState.messages, ...messages];
            return {
              earlierLoading: false,
              endReached: messages.length < messageCount,
              messages: newMessages,
            };
          });
        } else {
          this.setState({
            earlierLoading: false,
            endReached: true,
          });
        }
      };

      const APIKit = await createAPIKit();
      APIKit.get(
        `/chat/messages/${this.props.route.params.chatId}/${this.count}/${
          this.count + messageCount
        }/`,
        { cancelToken: this.cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          this.setState({ earlierLoading: false, error: handleAPIError(e) });
        });
    }
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => {
          this.sendMessages(messages);
        }}
        alwaysShowSend={true}
        loadEarlier={!this.state.endReached}
        onLoadEarlier={this.loadEarlierMessages}
        isLoadingEarlier={this.state.earlierLoading}
        infiniteScroll={true}
        onPressAvatar={(user) =>
          this.props.navigation.navigate("Profile", { username: user.name })
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Chat;
