import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import FastImage from "react-native-fast-image";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import AuthContext from "../../authContext";
import { createWSKit } from "./WSKit";
import { dateTimeDiff } from "../../utils";
import { avatarDefaultStyling, shimmerColors } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";
import { flashAlert } from "../../utils/flash_message";

const screenWidth = Dimensions.get("screen").width;

class ChatPreview extends Component {
  static contextType = AuthContext;

  state = {
    chatLoaded: false,
    lastMessage: undefined,
    lastRead: undefined,
    error: "",
  };

  componentDidMount = async () => {
    const chatSocket = await createWSKit(this.props.chat.id);

    chatSocket.onopen = () => {
      this.setState({ chatLoaded: true }); // cause lastMessage is coming from index
    };
    chatSocket.onmessage = (msg) => {
      this.onMessage(msg);
    };
    chatSocket.onerror = (error) => {
      this.onError(error);
    };

    this.closeConn = () => chatSocket.close(1000);
  };

  componentWillUnmount = () => {
    this.closeConn();
  };

  openChat = () => {
    this.props.navigateChat(this.props.chat.id, this.props.chat.user);
  };

  onMessage = async (message) => {
    // Update last message
    this.setState({ lastMessage: JSON.parse(message.data) });
  };

  onError = (error) => {
    flashAlert(error);
  };

  render = () => {
    if (this.state.chatLoaded) {
      const { chat } = this.props;
      // Do some whitespace slicing
      const sliceIndex = 15;
      let sliced = false;
      const lastMessage =
        this.state.lastMessage || this.props.chat.last_message;

      const lastReadDate = new Date(
        this.state.lastRead || this.props.last_read
      );

      let messageText =
        lastMessage && lastMessage.text
          ? `${
              this.context.user.username === lastMessage.sent_by.username
                ? "You: "
                : ""
            }${lastMessage.text}`
          : "Say hello";

      if (messageText.length > sliceIndex) {
        sliced = true;
        messageText = messageText.slice(0, sliceIndex);
      }

      let messageStyle = undefined;
      let lastMessageDate = undefined;
      let dateDiff = undefined;

      if (lastMessage) {
        lastMessageDate = new Date(lastMessage.sent_at);
        messageStyle =
          this.context.user.username !== lastMessage.sent_by.username &&
          lastMessageDate > lastReadDate
            ? {
                fontSize: 16,
                fontWeight: "bold",
              }
            : {
                fontSize: 16,
                fontWeight: "500",
              };

        dateDiff = dateTimeDiff(lastMessageDate);
      }

      return (
        <TouchableOpacity style={styles.container} onPress={this.openChat}>
          <Avatar
            rounded
            size={this.props.avatarSize}
            title={chat.user.username[0]}
            source={{ uri: chat.user.picture }}
            overlayContainerStyle={avatarDefaultStyling}
            ImageComponent={FastImage}
          />
          <View style={styles.textArea}>
            <Text style={styles.username}>{chat.user.username}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[messageStyle, { color: darkTheme.on_surface_subtitle }]}
              >
                {messageText}
                {sliced ? "... " : " "}
              </Text>
              {dateDiff && (
                <Text
                  style={[
                    messageStyle,
                    { color: darkTheme.on_surface_subtitle },
                  ]}
                >
                  {dateDiff}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.placeholder}>
          <ShimmerPlaceHolder
            width={this.props.avatarSize}
            height={this.props.avatarSize}
            shimmerStyle={{ borderRadius: this.props.avatarSize / 2 }}
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
  };
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "black",
    marginLeft: 20,
  },
  username: {
    fontSize: 20,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
  },
  textArea: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    width: screenWidth - 20,
    paddingBottom: 10,
  },
  placeholder: {
    width: screenWidth - 20,
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
  },
});

export default ChatPreview;
