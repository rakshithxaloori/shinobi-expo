import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import FastImage from "react-native-fast-image";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Username from "../components/profile/username";
import Socials from "../components/profile/socials";
import FollowStats from "../components/profile/follow/stats";
import FollowButton from "../components/profile/follow/button";
import BioText from "../components/profile/bio";
import EditProfileButton from "../components/profile/editProfile/button";
import Games from "../components/profile/games";
import Clips from "../components/posts";

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
    socials: undefined,
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

      this.setState({
        user,
        followers_count: followers,
        following_count: following,
        me_following,
        bio,
        socials,
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
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
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
              <Socials
                socials={this.state.socials}
                profile_loaded={this.state.profile_loaded}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Username
                user={this.state.user}
                profile_loaded={this.state.profile_loaded}
              />
              <FollowStats
                username={this.state.user?.username}
                followers_count={this.state.followers_count}
                following_count={this.state.following_count}
                profile_loaded={this.state.profile_loaded}
              />

              {this.state.profile_loaded && (
                <>
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
                      updateBioProfile={(newBio) =>
                        this.setState({ bio: newBio })
                      }
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
                </>
              )}
            </View>
          </View>
          <BioText
            profile_loaded={this.state.profile_loaded}
            bio={this.state.bio}
          />
          {typeof this.state.socials?.custom_url === "string" &&
            this.state.socials?.custom_url.length > 0 && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 3,
                }}
                onPress={() => Linking.openURL(this.state.socials.custom_url)}
              >
                <MaterialCommunityIcons
                  style={{ marginRight: 5 }}
                  name="link-variant"
                  size={18}
                  color={darkTheme.primary}
                />
                <Text style={styles.custom_url}>
                  {this.state.socials.custom_url}
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {this.state.user !== undefined && (
          <View style={{ width: "100%" }}>
            <Games username={this.state.user?.username} />
            <Clips username={this.state.user?.username} type="Profile" />
            <View />
          </View>
        )}
      </VirtualizedList>
    );
  };
}

const styles = StyleSheet.create({
  custom_url: {
    color: darkTheme.primary,
    fontSize: 15,
  },
  profile: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
  },
  button: {
    borderRadius: 5,
    backgroundColor: darkTheme.primary,
  },
  buttonText: { color: darkTheme.on_primary },
  container: {
    height: "100%",
    width: "100%",
    paddingBottom: 10,
  },
});

export default Profile;
