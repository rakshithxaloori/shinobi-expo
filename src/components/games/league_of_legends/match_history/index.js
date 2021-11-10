import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

import { createAPIKit } from "../../../../utils/APIKit";
import { handleAPIError } from "../../../../utils";
import Match from "./match";
import { darkTheme } from "../../../../utils/theme";

class MatchHistory extends Component {
  state = {
    initialLoading: true,
    endReached: false,
    matchHistory: [],
    isLoading: false,
    isRefreshing: false,
    status_code: undefined,
    error: "",
  };

  fetchCount = 10;
  cancelTokenSource = axios.CancelToken.source();
  unmounting = false;

  componentDidMount = async () => {
    await this.fetchMatches();
  };

  componentWillUnmount = () => {
    this.unmounting = true;
    this.cancelTokenSource.cancel();
  };

  fetchMatches = async () => {
    // Only 20 last matches
    if (
      this.state.matchHistory.length >= 20 ||
      this.state.endReached === true
    ) {
      this.setState({ endReached: true });
      return;
    }
    this.setState({ isLoading: true });

    const onSuccess = (response) => {
      let { match_history } = response.data?.payload;
      if (match_history === undefined) {
        match_history = [];
      }
      if (match_history.length < this.fetchCount) {
        this.setState({ endReached: true });
      }

      this.setState((prevState) => ({
        initialLoading: false,
        matchHistory: [...prevState.matchHistory, ...match_history],
        isLoading: false,
      }));
    };

    const APIKit = await createAPIKit();

    APIKit.post(
      "lol/matches/",
      {
        username: this.props.username,
        begin_index: this.state.matchHistory.length,
        end_index: this.state.matchHistory.length + this.fetchCount,
      },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        if (!axios.isCancel(e)) {
          const status_code = e.response.status;
          if (status_code === 412) {
            this.setState({
              status_code,
              initialLoading: false,
              error: handleAPIError(e),
            });
          } else {
            this.setState({
              initialLoading: false,
              error: handleAPIError(e),
            });
          }
        }
      });
  };

  placeholders = () => <View style={styles.list}>{/* TODO */}</View>;

  renderMatch = (match) => <Match match={match.item} />;

  keyExtractor = (match) => match.id.toString();

  refresh = async () => {
    const callFetch = async () => {
      this.fetchMatches().then(() => {
        this.setState({
          isRefreshing: false,
        });
      });
    };

    this.setState(
      {
        initialLoading: true,
        endReached: false,
        matchHistory: [],
        isLoading: false,
        isRefreshing: true,
        error: "",
      },
      callFetch // callback after state is set
    );
  };

  render = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Match History</Text>
      {this.state.initialLoading ? (
        <View>{this.placeholders()}</View>
      ) : this.state.matchHistory?.length > 0 ? (
        <FlatList
          data={this.state.matchHistory}
          refreshing={this.state.isRefreshing}
          onRefresh={this.refresh}
          renderItem={this.renderMatch}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchMatches}
          onEndReachedThreshold={3}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            this.state.endReached ? (
              <Text style={styles.endText}>
                {this.props.username}'s latest {this.state.matchHistory.length}{" "}
                matches
              </Text>
            ) : (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                animating={this.state.isLoading}
                color={darkTheme.on_background}
              />
            )
          }
        />
      ) : this.state.status_code === 412 ? (
        // TODO better way of doing this?
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Fetching matches from League of Legends servers.
          </Text>
          <Text style={styles.emptyText}>Come back after a quick break.</Text>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Wow, such empty.</Text>
          <Text style={styles.emptyText}>
            Looks like {this.props.username} is yet to begin his LoL battles!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: darkTheme.on_surface_subtitle,
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  endText: {
    color: darkTheme.on_surface_subtitle,
    fontWeight: "bold",
    marginTop: 5,
  },
  emptyText: { fontWeight: "600", color: darkTheme.on_surface_subtitle },
  empty: { justifyContent: "center", alignItems: "flex-start" },
  container: { flex: 1, paddingVertical: 5, paddingVertical: 10 },
});

export default MatchHistory;
