import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Avatar, Overlay, Divider } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import { handleAPIError } from "../../../../utils";

import { createAPIKit } from "../../../../utils/APIKit";
import { avatarDefaultStyling } from "../../../../utils/styles";
import { darkTheme } from "../../../../utils/theme";

class ChampionOverlay extends Component {
  state = {
    champion: undefined,
    error: "",
  };

  cancelTokenSource = axios.CancelToken.source();

  componentDidUpdate = async () => {
    if (this.props.visible && this.state.champion === undefined) {
      const onSuccess = (response) => {
        this.setState({
          champion: response.data?.payload?.champion,
        });
      };

      const APIKit = await createAPIKit();
      APIKit.get(`/lol/champion/${this.props.champion.key}/`, {
        cancelToken: this.cancelTokenSource.token,
      })
        .then(onSuccess)
        .catch((e) => {
          this.setState({
            error: handleAPIError(e),
          });
        });
    }
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  render = () => {
    const { visible, toggleOverlay, champion } = this.props;
    const iconSize = 60;
    return (
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            {this.state.champion ? (
              <Avatar
                rounded
                title={champion.name[0]}
                source={{ uri: champion.image }}
                containerStyle={styles.avatar}
                overlayContainerStyle={avatarDefaultStyling}
                size={iconSize}
              />
            ) : (
              <ShimmerPlaceHolder
                width={iconSize}
                height={iconSize}
                shimmerStyle={[styles.avatar, { borderRadius: iconSize / 2 }]}
              />
            )}
            {this.state.champion ? (
              <Text style={styles.text}>{champion.name} says hello!</Text>
            ) : (
              <ShimmerPlaceHolder
                width={60}
                shimmerStyle={[
                  styles.shimmerLine,
                  { borderRadius: 10, marginLeft: 10 },
                ]}
              />
            )}
          </View>
          <Divider
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              marginVertical: 5,
              marginHorizontal: 10,
            }}
            insetType="middle"
            orientation="vertical"
          />
          {this.state.champion ? (
            <View>
              {this.state.champion.blurb && (
                <View style={styles.section}>
                  <Text style={styles.headerText}>Blurb</Text>
                  <Text style={styles.text}>{this.state.champion.blurb}</Text>
                </View>
              )}

              {this.state.champion.allyTips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.headerText}>Ally Tips</Text>
                  {this.state.champion.allyTips.map((ally_tip, index) => (
                    <Text style={styles.text} key={index}>
                      {ally_tip}
                    </Text>
                  ))}
                </View>
              )}

              {this.state.champion.enemyTips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.headerText}>Enemy Tips</Text>
                  {this.state.champion.enemyTips.map((enemy_tip, index) => (
                    <Text style={styles.text} key={index}>
                      {enemy_tip}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View>
              <ShimmerPlaceHolder
                width={160}
                shimmerStyle={[styles.shimmerLine, { borderRadius: 10 }]}
              />
              <ShimmerPlaceHolder
                width={100}
                shimmerStyle={[styles.shimmerLine, { borderRadius: 10 }]}
              />
            </View>
          )}
        </ScrollView>
      </Overlay>
    );
  };
}

const styles = StyleSheet.create({
  avatar: { marginHorizontal: 5 },
  text: { color: darkTheme.on_background },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: darkTheme.on_background,
  },
  shimmerLine: { marginVertical: 5 },
  section: { flex: 1, marginBottom: 10 },
  container: {
    borderRadius: 5,
    width: Dimensions.get("window").width - 60,
    maxHeight: Dimensions.get("window").height - 100,
    justifyContent: "center",
    margin: 10,
    backgroundColor: darkTheme.background,
  },
});

export default ChampionOverlay;
