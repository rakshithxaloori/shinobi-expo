import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import LolMatch from "./lolMatch";
import { createAPIKit } from "../../utils/APIKit";
import { dateTimeDiff, handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";

const ITEM_HEIGHT = 110;
const ITEM_MARGIN = 5;

class MatchList extends Component {
  state = {
    matches: [],
    initLoaded: false,
    loading: false,
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
    const fetchMatchesNow = async () => {
      const onSuccess = async (response) => {
        const { feed, connect } = response.data?.payload;
        this.setState((prevState) => ({
          matches: [...prevState.matches, ...feed],
          connect,
          initLoaded: true,
          loading: false,
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

    this.setState({ loading: true }, fetchMatchesNow);
  };

  renderMatch = ({ item }) => {
    switch (item.game.name) {
      case "lol":
        const dateThen = new Date(item.participation.creation);
        const dateDiff = dateTimeDiff(dateThen);
        return (
          <LolMatch
            participation={item}
            height={ITEM_HEIGHT}
            margin={ITEM_MARGIN}
            dateDiff={dateDiff}
            navigateLolMatch={this.navigateLolMatch}
            navigateProfile={this.navigateProfile}
          />
        );
      default:
        return null;
    }
  };

  keyExtractor = (match) => {
    return match.participation.id;
    // return `${match.participation.id}+${Math.random().toFixed(3)}`;
  };

  getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + ITEM_MARGIN) * index,
    index,
  });

  navigateLolConnect = () => {
    this.props.navigation.navigate("LolConnect");
  };

  navigateLolMatch = (match_id) => {
    this.props.navigation.navigate("LolMatch", { match_id });
  };

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", { username });
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
        {this.state.initLoaded && this.state.matches.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.container}
            data={this.state.matches}
            onEndReached={this.fetchMatches}
            onEndReachedThreshold={3}
            renderItem={this.renderMatch}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <ActivityIndicator
                animating={this.state.loading}
                color={darkTheme.on_background}
              />
            }
            // Optimizations
            maxToRenderPerBatch={10}
            getItemLayout={this.getItemLayout}
          />
        ) : this.state.initLoaded ? (
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            {this.state.connect
              ? "Connect league of legends"
              : "Play a few matches"}{" "}
            or follow someone to fill up the feed!
          </Text>
        ) : null}
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
