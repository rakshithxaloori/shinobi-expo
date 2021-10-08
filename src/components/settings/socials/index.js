import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import { handleAPIError } from "../../../utils";
import { createAPIKit } from "../../../utils/APIKit";
import Twitch from "./twitch";
import YouTube from "./youtube";
import Instagram from "./instagram";
import { darkTheme } from "../../../utils/theme";

class SocialsSettings extends Component {
  state = {
    instagram: undefined,
    twitch: undefined,
    youtube: undefined,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const onSuccess = (response) => {
      console.log(response.data.payload);
      const { instagram, twitch, youtube } = response.data.payload;
      this.setState({ instagram, twitch, youtube });
      this.props.setSocialsLoaded(true);
    };

    const APIKit = await createAPIKit();
    APIKit.get("/socials/status/", {
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

  setError = (errorStr) => {
    this.setState({ error: errorStr });
  };

  placeholder = () => (
    <>
      <ShimmerPlaceHolder
        height={20}
        width={250}
        shimmerStyle={styles.placeholder}
      />
      <ShimmerPlaceHolder
        height={10}
        width={100}
        shimmerStyle={styles.placeholder}
      />
    </>
  );

  render = () => (
    <>
      {this.state.instagram !== undefined ? (
        <Instagram
          connectedBool={this.state.instagram}
          setError={this.setError}
        />
      ) : (
        this.placeholder()
      )}
      {this.state.twitch !== undefined ? (
        <Twitch connectedBool={this.state.twitch} setError={this.setError} />
      ) : (
        this.placeholder()
      )}
      {this.state.youtube !== undefined ? (
        <YouTube connectedBool={this.state.youtube} setError={this.setError} />
      ) : (
        this.placeholder()
      )}
    </>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
    borderRadius: 10,
  },
});

export const disconnectStyles = StyleSheet.create({
  button: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_surface_title,
  },
  cancelButton: {
    backgroundColor: darkTheme.surface,
    borderColor: darkTheme.primary,
    borderWidth: 2,
  },
  disconnectText: {
    fontSize: 15,
    fontWeight: "bold",
    color: darkTheme.on_primary,
  },
  disconnect: {
    backgroundColor: darkTheme.primary,
  },
  overlayTitle: {
    fontSize: 15,
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  overlay: {
    alignItems: "center",
    margin: 20,
    backgroundColor: darkTheme.background,
    borderColor: darkTheme.on_background,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default SocialsSettings;
