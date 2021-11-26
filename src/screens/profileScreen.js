import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";
import FastImage from "react-native-fast-image";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Username from "../components/profile/username";
import Socials from "../components/profile/socials";
import FollowStats from "../components/profile/follow/stats";
import FollowButton from "../components/profile/follow/button";
import BioText from "../components/profile/bio";
import EditProfileButton from "../components/profile/editProfile/button";
import Games from "../components/games";
import Clips from "../components/clips";

import { createAPIKit } from "../utils/APIKit";
import AuthContext from "../authContext";
import { handleAPIError } from "../utils";
import { avatarDefaultStyling, shimmerColors } from "../utils/styles";
import { darkTheme } from "../utils/theme";
import VirtualizedList from "../utils/virtualizedList";

class Profile extends Component {
  static contextType = AuthContext;
  state = {
    user: undefined,
    followers_count: undefined,
    following_count: undefined,
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

      if (this.context.user.username === user?.username) {
        const { saveUser } = this.context;
        saveUser(user);
      }

      const { instagram, twitch_profile, youtube } = socials;

      this.setState({
        user,
        followers_count: followers,
        following_count: following,
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
        followers_count: prevState.followers_count + 1,
      }));
    } else {
      if (!following) {
        this.setState((prevState) => ({
          followers_count: prevState.followers_count - 1,
        }));
      }
    }
    this.setState({ me_following: following });
  };

  render = () => {
    const profileIconSize = 80;
    const username = this.props.route?.params?.username;
    return (
      <VirtualizedList style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.profilePicture}>
            {this.state.profile_loaded ? (
              <Avatar
                rounded
                size={profileIconSize}
                title={this.state.user?.username[0] || "s"}
                source={{ uri: this.state.user.picture }}
                overlayContainerStyle={avatarDefaultStyling}
                ImageComponent={FastImage}
              />
            ) : (
              <ShimmerPlaceHolder
                width={profileIconSize}
                height={profileIconSize}
                shimmerStyle={{ borderRadius: profileIconSize / 2 }}
                shimmerColors={shimmerColors}
              />
            )}
          </View>
          <Username
            username={this.state.user?.username}
            profile_loaded={this.state.profile_loaded}
          />
          <FollowStats
            username={this.state.user?.username}
            followers_count={this.state.followers_count}
            following_count={this.state.following_count}
            profile_loaded={this.state.profile_loaded}
          />
          <Socials
            instagram_username={this.state.instagram?.username}
            twitch_profile={this.state.twitch}
            youtube_channel_id={this.state.youtube?.channel_id}
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
                  buttonTextStyle={styles.buttonText}
                />
              ) : (
                <EditProfileButton
                  username={this.context.user.username}
                  picture={this.state.user.picture}
                  bio={this.state.bio}
                  updateBioProfile={(newBio) => this.setState({ bio: newBio })}
                  updatePictureProfile={(newPicture) => {
                    const { saveUser } = this.context;
                    this.setState((prevState) => {
                      const newUser = {
                        username: prevState.user.username,
                        picture: newPicture,
                      };
                      saveUser(newUser);
                      return {
                        user: newUser,
                      };
                    });
                  }}
                  buttonStyle={styles.button}
                  buttonTextStyle={styles.buttonText}
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
          // <Games
          //   username={this.state.user?.username}
          //   reload={this.props.route?.params?.reload}
          // />
          <View style={{ width: "100%" }}>
            {/* Plays games */}
            <View />
            {/* My Clips */}
            <Clips username={this.state.user?.username} type="Profile" />
            <View />
          </View>
        )}
      </VirtualizedList>
    );
  };
}

const styles = StyleSheet.create({
  profile: {
    flex: 3,
    height: 200,
    backgroundColor: darkTheme.surface,
    borderRadius: 10,
    padding: 10,
  },
  profilePicture: {
    marginLeft: 10,
    position: "absolute",
    top: 10,
  },
  buttonContainer: {
    position: "absolute",
    top: 90,
    left: 120,
  },
  button: {
    borderRadius: 5,
    backgroundColor: darkTheme.primary,
  },
  buttonText: { color: darkTheme.on_primary },
  container: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Profile;
