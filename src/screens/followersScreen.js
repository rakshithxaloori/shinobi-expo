import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import MiniProfile from "../components/miniProfile";
import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";

class Followers extends Component {
  state = { followers: [], endReached: false, loaded: false, error: "" };
  fetchCount = 15;

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchFollowers();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchFollowers = async () => {
    if (this.state.endReached) return;
    const { username } = this.props.route.params;

    const onSuccess = async (response) => {
      const { followers } = response.data?.payload;
      this.setState({
        followers: followers,
        loaded: true,
        endReached: followers.length < this.fetchCount,
      });
    };

    const APIKit = await createAPIKit();
    APIKit.get(
      `/profile/followers/${username}/${this.state.followers.length}/${
        this.state.followers.length + this.fetchCount
      }/`,
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

  renderProfile = ({ item }) => {
    return <MiniProfile user={item.user} />;
  };

  keyExtractor = (profile) => profile.user.username;

  seperatorComponent = () => <View style={styles.seperator} />;

  render = () => {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.followers}
          renderItem={this.renderProfile}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchFollowers}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.seperatorComponent()}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  seperator: { borderWidth: 1, borderColor: darkTheme.on_background },
});

export default Followers;
