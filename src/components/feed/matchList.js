import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";

import LolMatch from "./lolMatch";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";

class MatchList extends Component {
  state = {
    matches: [],
    loaded: false,
    connect: false,
    isRefreshing: false,
    error: "",
  };

  fetchCount = 10;

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchMatches();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchMatches = async () => {
    const onSuccess = async (response) => {
      console.log(response.data.payload);
      const { feed, connect } = response.data?.payload;
      this.setState((prevState) => ({
        matches: [...prevState.matches, ...feed],
        connect,
        loaded: true,
      }));
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      `/feed/`,
      {
        begin_index: this.state.matches.length,
        end_index: this.fetchCount + this.state.matches.length,
      },
      {
        cancelToken: this.cancelTokenSource.token,
      }
    )
      .then(onSuccess)
      .catch((e) => {
        if (e.response.status === 404) {
          this.setState({ connect: true });
        }
        this.setState({
          error: handleAPIError(e),
        });
      });
  };

  renderMatch = ({ item }) => {
    switch (item.game.name) {
      case "lol":
        return <LolMatch participation={item} />;
      default:
        return null;
    }
  };

  keyExtractor = (match) => match.participation.id;

  navigateLolConnect = () => {
    this.props?.navigateConnect();
  };

  render = () => {
    return (
      <View style={styles.container}>
        {this.state.connect && (
          <TouchableOpacity
            style={styles.connect}
            onPress={this.navigateLolConnect}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Connect League of Legends
            </Text>
          </TouchableOpacity>
        )}
        {this.state.loaded && this.state.matches.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.container}
            data={this.state.matches}
            onEndReached={this.fetchMatches}
            onEndReachedThreshold={3}
            renderItem={this.renderMatch}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            {this.state.connect
              ? "Connect league of legends"
              : "Play a few matches"}{" "}
            or follow someone to fill up the feed!
          </Text>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  connect: {
    backgroundColor: darkTheme.surface,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 50,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
  container: { marginTop: 10, paddingHorizontal: 15 },
});

export default MatchList;
