import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import MatchHistory from "./match_history";
import ChampionMasteries from "./championMasteries";

import { createAPIKit } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { avatarDefaultStyling } from "../../../utils/styles";
import CustomSwitch from "./switch";
import AuthContext from "../../../authContext";

import { darkTheme } from "../../../utils/theme";

class LeagueOfLegendsProfile extends Component {
  static contextType = AuthContext;
  state = {
    name: "",
    level: "",
    platform: "",
    profile_icon: "",
    profile_loaded: false,
    toggleVal: 1,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();
  unsubscribe = undefined;

  fetchLolProfile = async () => {
    const onSuccess = (response) => {
      const { payload } = response.data;
      this.setState({
        name: payload.name,
        level: payload.level,
        platform: payload.platform,
        profile_icon: payload.profile_icon,
        profile_loaded: true,
      });
    };

    const APIKit = await createAPIKit();
    APIKit.get(`/lol/profile/${this.props.username}/`, {
      cancelToken: this.cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        if (!axios.isCancel && e.response.status === 404) {
          // No League of Legends profile
          this.setState({
            profile_loaded: null,
            error: "No League of Legends Profile",
          });
        } else {
          this.setState({ profile_loaded: null, error: handleAPIError(e) });
        }
      });
  };

  reloadLolProfile = async () => {
    // The screen is focused
    // Call any action
    console.log(this.props);
    if (this.props.reload === true) {
      this.setState(
        {
          name: "",
          level: "",
          platform: "",
          profile_icon: "",
          profile_loaded: false,
          toggleVal: 1,
          error: "",
        },
        async () => {
          await this.fetchLolProfile();
        }
      );
    }
  };

  componentDidMount = async () => {
    this.unsubscribe = this.props.navigation.addListener(
      "focus",
      this.reloadLolProfile
    );
    await this.fetchLolProfile();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
    this.unsubscribe();
  };

  toggle = (val) => {
    this.setState({ toggleVal: val });
  };

  render = () => {
    const avatarSize = 33;
    return (
      <View style={styles.container}>
        {this.state.profile_loaded === true ? (
          <View style={styles.profile}>
            <Avatar
              size={avatarSize}
              title={this.state.name[0]}
              source={{ uri: this.state.profile_icon }}
              overlayContainerStyle={[avatarDefaultStyling, styles.avatar]}
            />
            <View style={{ flexDirection: "row", flex: 2 }}>
              <Text style={styles.summonerName}>{this.state.name}</Text>
              <Text style={[styles.summonerName, { fontWeight: "bold" }]}>
                #{this.state.platform.replace(/[0-9]/g, "")}
              </Text>
            </View>
            <Text style={styles.summonerLevel}>Lv.{this.state.level}</Text>
            <CustomSwitch
              selectionColor={darkTheme.primary}
              onSelectSwitch={this.toggle}
              toggleVal={this.state.toggleVal}
            />
          </View>
        ) : this.state.profile_loaded === false ? (
          <View style={styles.profile}>
            <ShimmerPlaceHolder
              width={avatarSize}
              height={avatarSize}
              shimmerStyle={styles.avatar}
            />
            <ShimmerPlaceHolder
              width={99}
              shimmerStyle={{
                marginLeft: 10,
                alignSelf: "center",
                borderRadius: 10,
              }}
            />
          </View>
        ) : this.context.user.username === this.props.username ? (
          <TouchableOpacity
            style={styles.connect}
            onPress={() => {
              this.props.navigation.navigate("LolConnect");
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Connect League of Legends
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noprofile}>{this.state.error}</Text>
        )}
        {this.state.profile_loaded && (
          <View style={styles.gameData}>
            {this.state.toggleVal === 1 ? (
              <MatchHistory username={this.props.username} />
            ) : (
              <ChampionMasteries username={this.props.username} />
            )}
          </View>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  noprofile: { color: darkTheme.on_surface_title, fontWeight: "600" },
  avatar: { borderRadius: 10 },
  summonerName: {
    fontSize: 17,
    alignSelf: "center",
    marginLeft: 10,
    color: darkTheme.on_surface_title,
  },
  summonerLevel: {
    flex: 1,
    fontSize: 17,
    alignSelf: "center",
    color: darkTheme.on_surface_subtitle,
  },
  profile: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: darkTheme.surface,
    alignItems: "center",
    borderRadius: 10,
  },
  connect: {
    backgroundColor: darkTheme.surface,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 50,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
  gameData: { flex: 8 },
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 10,
    justifyContent: "center",
  },
});

export default LeagueOfLegendsProfile;
