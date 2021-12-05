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
import { shimmerColors } from "../../../utils/styles";

class SocialsSettings extends Component {
  state = {
    instagram: undefined,
    twitch: undefined,
    youtube: undefined,
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const onSuccess = (response) => {
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
        handleAPIError(e);
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
        shimmerColors={shimmerColors}
      />
      <ShimmerPlaceHolder
        height={10}
        width={100}
        shimmerStyle={styles.placeholder}
        shimmerColors={shimmerColors}
      />
    </>
  );

  render = () => (
    <>
      {/* {this.state.instagram !== undefined ? (
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
      )} */}
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

export default SocialsSettings;
