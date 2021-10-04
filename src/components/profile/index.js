import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Username from "./username";
import Socials from "./socials";
import FollowStats from "./followStats";
import FollowButton from "./followButton";
import BioText from "./bioText";
import Games from "../games";

import { createAPIKit } from "../../utils/APIKit";
import AuthContext from "../../authContext";
import { handleAPIError } from "../../utils";
import EditProfileButton from "./editProfileButton";
import { avatarDefaultStyling } from "../../utils/styles";
import { lightTheme } from "../../utils/theme";

class Profile extends Component {
  static contextType = AuthContext;
  state = {
    user: undefined,
    followers: undefined,
    following: undefined,
    me_following: undefined,
    bio: undefined,
    lol_profile: undefined,
    instagram: undefined,
    twitch: undefined,
    youtube: undefined,
    profile_loaded: false,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    // Request the server for profile
    const onSuccess = async (response) => {
      const { user, followers, following, me_following, bio, socials } =
        response.data.payload.profile;

      const { instagram, twitch_profile, youtube } = socials;

      this.setState({
        user,
        followers,
        following,
        me_following,
        bio,
        instagram,
        twitch: twitch_profile,
        youtube,
        profile_loaded: true,
      });
    };

    const username = this.props.route?.params?.username;

    const url =
      !username || this.context.user.username === username
        ? "/profile/my/"
        : `/profile/u/${username ? username + "/" : ""}`;

    const APIKit = await createAPIKit();
    APIKit.get(url, {
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

  setFollowing = (following) => {
    if (following) {
      this.setState((prevState) => ({
        followers: prevState.followers + 1,
      }));
    } else {
      if (!following) {
        this.setState((prevState) => ({
          followers: prevState.followers - 1,
        }));
      }
    }
    this.setState({ me_following: following });
  };

  render = () => {
    const profileIconSize = 80;
    const username = this.props.route?.params?.username;
    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.profilePicture}>
            {this.state.profile_loaded ? (
              <Avatar
                rounded
                size={profileIconSize}
                title={this.state.user.username[0]}
                source={{ uri: this.state.user.picture }}
                overlayContainerStyle={avatarDefaultStyling}
              />
            ) : (
              <ShimmerPlaceHolder
                width={profileIconSize}
                height={profileIconSize}
                shimmerStyle={{ borderRadius: profileIconSize / 2 }}
              />
            )}
          </View>
          <Username
            username={this.state.user?.username}
            profile_loaded={this.state.profile_loaded}
          />
          <FollowStats
            followers={this.state.followers}
            following={this.state.following}
            profile_loaded={this.state.profile_loaded}
          />
          <Socials
            instagram_username={this.state.instagram?.username}
            twitch_profile={this.state.twitch}
            youtube_channel_id={this.state.youtube}
            profile_loaded={this.state.profile_loaded}
          />
          {this.state.profile_loaded && (
            <View style={styles.buttonContainer}>
              {username && this.context.user.username !== username ? (
                <FollowButton
                  username={username}
                  following={this.state.me_following}
                  setFollowing={this.setFollowing}
                  buttonStyle={styles.button}
                />
              ) : (
                <EditProfileButton
                  username={this.context.user.username}
                  picture={this.state.user.picture}
                  bio={this.state.bio}
                  setBio={(newBio) => this.setState({ bio: newBio })}
                  buttonStyle={styles.button}
                />
              )}
            </View>
          )}
          <BioText
            profile_loaded={this.state.profile_loaded}
            bio={this.state.bio}
          />
        </View>

        {this.state.user !== undefined && (
          <Games
            username={this.state.user?.username}
            reload={this.props.route?.params?.reload}
          />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  profile: {
    width: "100%",
    height: 200,
  },
  profilePicture: {
    marginLeft: 10,
    position: "absolute",
    top: 10,
  },
  buttonContainer: {
    position: "absolute",
    top: 105,
    left: 150,
  },
  button: {
    borderRadius: 5,
    backgroundColor: lightTheme.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
});

export default Profile;
