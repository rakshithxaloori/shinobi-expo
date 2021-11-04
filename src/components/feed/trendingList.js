import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

import TrendingProfile from "./trendingProfile";
import AuthContext from "../../authContext";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";

class TrendingList extends Component {
  static contextType = AuthContext;
  state = {
    profiles: [],
    loaded: false,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    // Load profiles
    const onSuccess = async (response) => {
      const { profiles } = response.data?.payload;
      this.setState({ profiles, loaded: true });
    };

    const APIKit = await createAPIKit();
    APIKit.get("/profile/trending/", {
      cancelToken: this.cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        this.setState({
          error: handleAPIError(e),
        });
      });
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  renderProfile = (profile) => (
    <TrendingProfile
      profile={profile}
      navigateProfile={this.props.navigateProfile}
    />
  );

  keyExtractor = (profile) => profile.user.username;

  render = () => {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.profiles}
          renderItem={this.renderProfile}
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

export default TrendingList;
