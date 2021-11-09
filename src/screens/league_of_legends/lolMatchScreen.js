import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";

import Team from "../../components/games/league_of_legends/match/team";

class Match extends Component {
  state = {
    creation: undefined,
    teams: [],
    mode: undefined,
    region: undefined,
    loaded: false,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const { match_id } = this.props.route.params;

    if (!match_id) {
      this.setState({ error: "No match id in props" });
      return;
    }

    const onSuccess = (response) => {
      const { creation, blue_team, red_team, mode, region } =
        response.data.payload?.match;
      this.setState({
        creation,
        teams: [blue_team, red_team],
        mode,
        region,
        loaded: true,
      });
    };

    const APIKit = await createAPIKit();
    APIKit.get(`/lol/match/${match_id}`, {
      cancelToken: this.cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        this.setState({ error: handleAPIError(e) });
      });
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  renderTeam = ({ item }) => <Team team={item} />;

  keyExtractor = (item) => item.color;

  render = () =>
    this.state.loaded ? (
      <View style={styles.container}>
        <FlatList
          key="#"
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          data={this.state.teams}
          renderItem={this.renderTeam}
          keyExtractor={this.keyExtractor}
        />
      </View>
    ) : (
      <View style={styles.container} />
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Match;
