import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import LolMatch from "./lolMatch";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";

class MatchList extends Component {
  state = {
    matches: [],
    loaded: false,
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
      console.log(
        "-------------------------------\n",
        response.data?.payload.feed[0]
      );
      const { feed } = response.data?.payload;
      this.setState({ matches: feed, loaded: true });
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

  render = () => {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.matches}
          renderItem={this.renderMatch}
          keyExtractor={this.keyExtractor}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={this.renderSeperator}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { marginTop: 10, paddingHorizontal: 15 },
});

export default MatchList;
