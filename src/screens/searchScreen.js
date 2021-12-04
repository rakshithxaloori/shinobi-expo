import React, { Component } from "react";
import { View, SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import { SearchBar, Divider } from "react-native-elements";
import axios from "axios";

import SearchItem from "../components/search/searchItem";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";

class Search extends Component {
  state = {
    users: [],
    search: "",
    loading: false,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  updateSearch = (search) => {
    this.setState({ search, loading: true });
    if (search === "") this.setState({ users: undefined });
  };

  componentDidUpdate = async () => {
    if (this.state.loading && this.state.search) {
      const onSuccess = (response) => {
        this.setState({
          users: response.data?.payload?.users,
          loading: false,
        });
      };

      const APIKit = await createAPIKit();
      APIKit.get(`/profile/search/${this.state.search}/`, {
        cancelToken: this.cancelTokenSource.token,
      })
        .then(onSuccess)
        .catch((e) => {
          this.setState({ error: handleAPIError(e) });
        });
    }
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  navigateProfile = (username) => {
    this.props.navigation.navigate("Profile", {
      username: username,
    });
  };

  renderSeperator = () => (
    <Divider
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 0,
        marginVertical: 3,
      }}
      insetType="middle"
      orientation="horizontal"
    />
  );

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          autoCapitalize="none"
          darkTheme={true}
          onChangeText={this.updateSearch}
          value={this.state.search}
          onClear={() => {
            this.setState({
              users: [],
            });
          }}
        />
        {this.state.users.length > 0 ? (
          <ScrollView
            style={styles.searchList}
            keyboardShouldPersistTaps="handled"
          >
            {this.state.users.map((user, index) => (
              <SearchItem
                key={index}
                profile={user}
                navigateProfile={this.navigateProfile}
              />
            ))}
          </ScrollView>
        ) : this.state.search !== "" ? (
          <View style={styles.empty}>
            <Text style={styles.text}>
              Couldn't find "{this.state.search}"{" "}
            </Text>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.text}>who are you looking for?</Text>
          </View>
        )}
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  searchItem: { alignItems: "center", paddingVertical: 5 },
  searchList: {
    flex: 1,
    padding: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  text: { fontWeight: "600", color: darkTheme.on_surface_subtitle },
  container: {
    flex: 1,
  },
});

export default Search;
