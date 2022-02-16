import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { darkTheme } from "../utils/theme";
import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { flashAlert } from "../utils/flash_message";

const INPUT_FONT_SIZE = 15;
const ICON_SIZE = 17;

const CustomInput = ({
  prefix,
  value,
  placeholder,
  label,
  maxLength,
  iconName,
  onChangeText,
}) => (
  <View style={{ marginBottom: 20 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons
        style={styles.icon}
        name={iconName}
        size={ICON_SIZE}
        color={darkTheme.primary}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        height: 40,
        alignItems: "center",
      }}
    >
      <Text style={styles.prefix}>{prefix}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        style={styles.input}
        placeholderTextColor={darkTheme.on_surface_subtitle}
        onChangeText={onChangeText}
      />
    </View>
  </View>
);

class Socials extends Component {
  state = {
    youtube: "",
    instagram: "",
    twitch: "",
    custom_url: "",
  };

  componentDidMount = async () => {
    await this.getSocials();
  };

  getSocials = async () => {
    const onSuccess = (response) => {
      const { youtube, instagram, twitch, custom_url } = response.data?.payload;
      this.setState({ youtube, instagram, twitch, custom_url });
    };

    const APIKit = await createAPIKit();
    APIKit.get("socials/get/")
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });
  };

  updateSocials = async () => {
    const expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(expression);

    if (this.state.custom_url !== "") {
      if (!this.state.custom_url.trim().match(regex)) {
        flashAlert("Custom Link is invalid");
        return;
      }
    }

    const onSuccess = () => {
      flashAlert("Socials updated!");
      Keyboard.dismiss();
    };

    const APIKit = await createAPIKit();
    APIKit.post("socials/update/", {
      youtube: this.state.youtube.trim(),
      instagram: this.state.instagram.trim(),
      twitch: this.state.twitch.trim(),
      custom_url: this.state.custom_url.trim(),
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
          prefix="https://instagram.com/"
          value={this.state.instagram}
          placeholder="username"
          label="Instagram"
          maxLength={30}
          iconName="logo-instagram"
          onChangeText={(text) => {
            this.setState({ instagram: text });
          }}
        />
        <CustomInput
          prefix="https://youtube.com/channel/"
          value={this.state.youtube}
          placeholder="channel ID"
          label="YouTube"
          maxLength={24}
          iconName="logo-youtube"
          onChangeText={(text) => {
            this.setState({ youtube: text });
          }}
        />
        <CustomInput
          prefix="https://twitch.tv/"
          value={this.state.twitch}
          placeholder="username"
          label="Twitch"
          maxLength={25}
          iconName="logo-twitch"
          onChangeText={(text) => {
            this.setState({ twitch: text });
          }}
        />

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="link-variant"
              size={ICON_SIZE + 3}
              color={darkTheme.primary}
            />
            <Text style={styles.label}>Custom Link</Text>
          </View>
          <View style={{ height: 80 }}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.custom_url}
              style={styles.input}
              placeholder="https://example.com"
              placeholderTextColor={darkTheme.on_surface_subtitle}
              onChangeText={(text) => {
                this.setState({ custom_url: text });
              }}
            />
          </View>
        </View>

        <TouchableOpacity onPress={this.updateSocials} style={styles.save}>
          <Ionicons name="save" color={darkTheme.primary} size={35} />
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  label: {
    color: darkTheme.on_background,
    fontSize: ICON_SIZE + 3,
    fontWeight: "bold",
  },
  prefix: { color: darkTheme.on_surface_subtitle, fontSize: INPUT_FONT_SIZE },
  input: {
    color: darkTheme.on_background,
    fontSize: INPUT_FONT_SIZE,
    borderBottomWidth: 1,
    borderColor: darkTheme.on_background,
    padding: 5,
    marginVertical: 5,
  },
  icon: { marginRight: 8 },
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
