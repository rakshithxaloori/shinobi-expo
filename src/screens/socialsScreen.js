import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../utils/theme";
import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { flashAlert } from "../utils/flash_message";

const CustomInput = ({
  value,
  placeholder,
  label,
  maxLength,
  iconName,
  onChangeText,
}) => (
  <Input
    autoCapitalize="none"
    autoCorrect={false}
    placeholder={placeholder}
    label={label}
    maxLength={maxLength}
    value={value}
    inputStyle={styles.input}
    leftIcon={() => (
      <Ionicons
        style={styles.icon}
        name={iconName}
        size={20}
        color={darkTheme.primary}
      />
    )}
    onChangeText={onChangeText}
  />
);

class Socials extends Component {
  state = {
    youtube: "",
    instagram: "",
    twitch: "",
  };

  componentDidMount = async () => {
    await this.getSocials();
  };

  getSocials = async () => {
    const onSuccess = (response) => {
      const { youtube, instagram, twitch } = response.data?.payload;
      this.setState({ youtube, instagram, twitch });
    };

    const APIKit = await createAPIKit();
    APIKit.get("socials/get/")
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  updateSocials = async () => {
    // TODO set socials
    // TODO can't have spaces
    const minTwitchLen = 4;
    const minYTLen = 24;

    const onSuccess = () => {
      flashAlert("Socials updated!");
    };

    // TODO if urls, parse them

    const APIKit = await createAPIKit();
    APIKit.post("socials/update/", {
      youtube: this.state.youtube,
      instagram: this.state.instagram,
      twitch: this.state.twitch,
    })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  render = () => {
    return (
      <View style={styles.container} showsVerticalScrollIndicator={false}>
        <CustomInput
          value={this.state.instagram}
          placeholder="Username or Profile URL"
          label="Instagram"
          maxLength={30}
          iconName="logo-instagram"
          onChangeText={(text) => {
            this.setState({ instagram: text });
          }}
        />
        <CustomInput
          value={this.state.youtube}
          placeholder="Channel ID or URL with Channel ID"
          label="YouTube"
          maxLength={24}
          iconName="logo-youtube"
          onChangeText={(text) => {
            this.setState({ youtube: text });
          }}
        />
        <CustomInput
          value={this.state.twitch}
          placeholder="Username or Channel URL"
          label="Twitch"
          maxLength={25}
          iconName="logo-twitch"
          onChangeText={(text) => {
            this.setState({ twitch: text });
          }}
        />
        <TouchableOpacity onPress={this.updateSocials} style={styles.save}>
          <Ionicons name="save" color={darkTheme.primary} size={35} />
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  input: { color: darkTheme.on_background, fontSize: 15 },
  icon: { paddingRight: 5 },
  save: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: darkTheme.surface,
    borderRadius: 20,
  },
  container: { flex: 1, padding: 20 },
});

export default Socials;
