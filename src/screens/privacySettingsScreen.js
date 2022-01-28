import axios from "axios";
import React, { Component } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { handleAPIError } from "../utils";

import { createAPIKit } from "../utils/APIKit";
import { darkTheme } from "../utils/theme";

const Setting = ({ text, value, toggleValue }) => {
  return (
    <View style={styles.setting}>
      <Switch
        trackColor={{ false: darkTheme.surface, true: darkTheme.primary }}
        thumbColor={darkTheme.on_background}
        onValueChange={toggleValue}
        value={value}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

class PrivacySettingsScreen extends Component {
  state = {
    showFlag: false,
  };
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchSettings();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchSettings = async () => {
    const onSuccess = (response) => {
      const { show_flag } = response.data.payload;
      this.setState({ showFlag: show_flag });
    };

    const APIKit = await createAPIKit();
    APIKit.get("settings/get/privacy/", {
      cancelToken: this.cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        handleAPIError(e);
      });
  };

  updateSettings = async () => {
    // Send API request
    const APIKit = await createAPIKit();
    APIKit.post(
      "settings/update/privacy/",
      { settings: { show_flag: this.state.showFlag } },
      { cancelToken: this.cancelTokenSource.token }
    ).catch((e) => {
      handleAPIError(e);
    });
  };

  toggleFlag = async () => {
    this.setState(
      (prevState) => ({ showFlag: !prevState.showFlag }),
      this.updateSettings
    );
  };

  render = () => {
    return (
      <View style={styles.container}>
        <Setting
          text="Show flag on profile 🏳️"
          value={this.state.showFlag}
          toggleValue={this.toggleFlag}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
  },
  setting: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  text: { color: darkTheme.on_background, marginLeft: 10, fontSize: 17 },
});

export default PrivacySettingsScreen;
