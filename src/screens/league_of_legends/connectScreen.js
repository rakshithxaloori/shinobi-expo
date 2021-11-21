import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Avatar, Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { CommonActions } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

import { createAPIKit } from "../../utils/APIKit";
import { darkTheme } from "../../utils/theme";
import { handleAPIError } from "../../utils";
import { avatarDefaultStyling } from "../../utils/styles";

class LolConnect extends Component {
  state = {
    stage: 1,
    summoner_name: "",
    platform: "BR1",
    disabled: false,

    old_profile_icon: undefined,
    new_profile_icon: undefined,

    labelColor: darkTheme.on_background,
    error: "",
  };

  profileIconSize = 100;

  getNewProfileIcon = async () => {
    if (!this.state.summoner_name) {
      this.setState({ error: "summoner name can't be empty" });
      return;
    }
    this.setState({ disabled: true, error: "" });

    const onSuccess = (response) => {
      const { old_profile_icon, new_profile_icon } = response.data?.payload;
      this.setState({
        old_profile_icon,
        new_profile_icon,
        stage: 2,
        disabled: false,
      });
    };

    const APIKit = await createAPIKit();
    APIKit.post("lol/connect/", {
      summoner_name: this.state.summoner_name,
      platform: this.state.platform,
    })
      .then(onSuccess)
      .catch((e) => {
        this.setState({ error: handleAPIError(e), disabled: false });
      });
  };

  verify = async () => {
    const onSuccess = (response) => {
      // this.props.navigation.navigate("Profile", { reload: true });
      this.props.navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "Home" }, { name: "Profile" }],
          index: 1,
        })
      );
    };

    const APIKit = await createAPIKit();
    APIKit.get("lol/verify/")
      .then(onSuccess)
      .catch((e) => {
        const status_code = e.response.status;
        if (status_code === 404 || status_code === 409) {
          this.setState({ stage: 1, error: handleAPIError(e) });
        } else {
          this.setState({ error: handleAPIError(e) });
        }
      });
  };

  toggleLabelColor = () => {
    this.setState((prevState) => ({
      labelColor:
        prevState.labelColor === darkTheme.background
          ? darkTheme.on_background
          : darkTheme.background,
    }));
  };

  render = () => (
    <View style={styles.container}>
      {this.state.stage === 1 ? (
        <>
          <Input
            style={{ width: "60%" }}
            editable={!this.state.disabled}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="eg: rock_lee"
            label="Summoner Name"
            labelStyle={{ color: darkTheme.on_background }}
            inputStyle={{ color: darkTheme.on_background }}
            leftIcon={{ type: "ionicons", name: "person-outline" }}
            value={this.state.summoner_name}
            onChangeText={(value) => {
              this.setState({
                error: "",
                summoner_name: value.trim(),
              });
            }}
            errorStyle={{ color: "red" }}
            errorMessage={this.state.error}
          />
          <View style={styles.picker}>
            <Picker
              enabled={!this.state.disabled}
              mode="dropdown"
              selectedValue={this.state.platform}
              onValueChange={(value) => {
                this.setState({ platform: value });
              }}
              itemStyle={{
                fontSize: 15,
              }}
              dropdownIconColor={darkTheme.on_background}
              dropdownIconRippleColor={darkTheme.on_background}
              onFocus={this.toggleLabelColor}
              onBlur={this.toggleLabelColor}
            >
              <Picker.Item
                color={this.state.labelColor}
                label="Brazil"
                value="BR1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Europe Nordic & East"
                value="EUN1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Europe West"
                value="EUW1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Latin America North"
                value="LA1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Latin America South"
                value="LA2"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Japan"
                value="JP1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Republic of Korea"
                value="KR"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="North America"
                value="NA1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Oceania"
                value="OC1"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Russia"
                value="RU"
              />
              <Picker.Item
                color={this.state.labelColor}
                label="Turkey"
                value="TR1"
              />
            </Picker>
          </View>

          <TouchableOpacity
            disabled={this.state.disabled}
            onPress={this.getNewProfileIcon}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Connect League of Legends</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Change your profile icon to verify</Text>
          <View style={{ alignItems: "flex-start" }}>
            <Text style={styles.subtitle}>Open League of Legends game</Text>
            <Text style={styles.subtitle}>
              Change your profile icon to the one below
            </Text>
            <Text style={styles.subtitle}>Then hit verify</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Avatar
              rounded
              size={this.profileIconSize}
              title={this.state.summoner_name[0]}
              source={{ uri: this.state.new_profile_icon }}
              overlayContainerStyle={avatarDefaultStyling}
              ImageComponent={FastImage}
            />
          </View>
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={[styles.subtitle, { fontWeight: "normal", marginTop: 10 }]}
            >
              You can change profile icon back after verification
            </Text>
            <Text
              style={[styles.subtitle, { fontWeight: "normal", marginTop: 10 }]}
            >
              Don't change profile icon if someone else asks you to change
            </Text>
          </View>
          <TouchableOpacity
            disabled={this.state.disabled}
            onPress={this.verify}
            style={styles.button}
          >
            <Text style={[styles.buttonText, { fontSize: 18 }]}>Verify</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 200,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonText: {
    color: darkTheme.on_background,
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  button: {
    height: 40,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: darkTheme.surface,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    color: darkTheme.on_surface_title,
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    color: darkTheme.on_surface_subtitle,
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 3,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LolConnect;
