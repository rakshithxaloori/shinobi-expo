import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import MiniProfile from "../miniProfile";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { darkTheme } from "../../utils/theme";

class Following extends Component {
  state = { following: [], endReached: false, loaded: false, error: "" };
  fetchCount = 15;

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchFollowing();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchFollowing = async () => {
    if (this.state.endReached) return;
    const { username } = this.props.route.params;

    const onSuccess = async (response) => {
      const { following } = response.data?.payload;
      this.setState({
        following: following,
        loaded: true,
        endReached: following.length < this.fetchCount,
      });
    };

    const APIKit = await createAPIKit();
    APIKit.get(
      `/profile/following/${username}/${this.state.following.length}/${
        this.state.following.length + this.fetchCount
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
    return <MiniProfile user={item.user} game_alias={item.game_alias} />;
  };

  keyExtractor = (profile) => profile.user.username;

  seperatorComponent = () => <View style={styles.seperator} />;

  render = () => {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.following}
          renderItem={this.renderProfile}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchFollowing}
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

export default Following;
