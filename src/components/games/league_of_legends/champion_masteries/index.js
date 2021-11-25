import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Divider } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import axios from "axios";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import { handleAPIError } from "../../../../utils";
import { createAPIKit } from "../../../../utils/APIKit";

import ChampionMastery from "./mastery";
import { darkTheme } from "../../../../utils/theme";
import { shimmerColors } from "../../../../utils/styles";

const numColumns = 4;

class ChampionMasteriesByLevel extends Component {
  state = {
    initialLoading: true,
    championMasteries: [],
    championMasteriesByLevel: [],
    isLoading: false,
    endReached: false,
    error: "",
  };

  fetchCount = 50;
  avatarSize = 45;
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    await this.fetchChampionMasteries();
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  fetchChampionMasteries = async () => {
    if (this.state.endReached || this.state.isLoading) return;

    this.setState({ isLoading: true });

    const onSuccess = (response) => {
      const { champion_masteries, count } = response.data?.payload;
      this.setState((prevState) => {
        let grouped = {};

        const newChampionMasteries = [
          ...prevState.championMasteries,
          ...champion_masteries,
        ];

        for (const championMastery of newChampionMasteries) {
          const level = championMastery.level;
          if (!grouped[level]) grouped[level] = [];
          grouped[level].push(championMastery);
        }

        const newChampionMasteriesByLevel = [];

        for (const [key, value] of Object.entries(grouped)) {
          newChampionMasteriesByLevel.push({
            level: key,
            champion_masteries: value,
          });
        }

        const compFunc = (firstEl, secondEl) =>
          parseInt(secondEl.level) - parseInt(firstEl.level);

        return {
          initialLoading: false,
          championMasteries: newChampionMasteries,
          championMasteriesByLevel: newChampionMasteriesByLevel.sort(compFunc),
          endReached: count !== this.fetchCount,
          isLoading: false,
        };
      });
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "lol/masteries/",
      {
        username: this.props.username,
        begin_index: this.state.championMasteries.length,
        end_index: this.state.championMasteries.length + this.fetchCount,
      },
      {
        cancelToken: this.cancelTokenSource.token,
      }
    )
      .then(onSuccess)
      .catch((e) => {
        this.setState({
          error: handleAPIError(e),
        });
      });
  };

  renderPlaceholder = () => (
    <ShimmerPlaceHolder
      width={this.avatarSize}
      height={this.avatarSize}
      shimmerStyle={[styles.placeholder, { borderRadius: this.avatarSize / 2 }]}
      shimmerColors={shimmerColors}
    />
  );

  plKeyExtractor = (index) => index;

  renderChampionMastery = ({ item }) => (
    <ChampionMastery championMastery={item} size={this.avatarSize} />
  );

  cmKeyExtractor = (champion) => champion.key;

  renderLevel = ({ item }) => (
    <View>
      <Text style={styles.levelHeader}>Level {item.level}</Text>
      <FlatList
        data={item.champion_masteries}
        renderItem={this.renderChampionMastery}
        keyExtractor={this.cmKeyExtractor}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
      />
    </View>
  );

  renderSeperator = () => (
    <Divider
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 40,
        marginVertical: 10,
      }}
      insetType="middle"
      orientation="horizontal"
    />
  );

  keyExtractor = ({ level }) => level;

  render = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Champion Masteries</Text>
      {this.state.initialLoading ? (
        <FlatList
          key={"#"}
          data={[...Array(numColumns * 3).keys()]}
          renderItem={this.renderPlaceholder}
          keyExtractor={this.plKeyExtractor}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
        />
      ) : this.state.championMasteriesByLevel.length > 0 ? (
        <FlatList
          key={"_"}
          data={this.state.championMasteriesByLevel}
          renderItem={this.renderLevel}
          keyExtractor={this.keyExtractor}
          onEndReached={this.fetchChampionMasteries}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeperator}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.state.isLoading}
              color={darkTheme.on_background}
            />
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Wow, such empty.</Text>
          <Text style={styles.emptyText}>
            Looks like {this.props.username} is yet to begin his LoL battles!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "100%", paddingVertical: 5, paddingVertical: 10 },
  header: {
    marginBottom: 5,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  emptyText: { fontWeight: "600" },
  empty: { justifyContent: "center", alignItems: "flex-start" },
  levelHeader: {
    color: darkTheme.on_surface_subtitle,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    marginLeft: 5,
    marginBottom: 5,
  },
  placeholder: { marginHorizontal: 2, marginVertical: 5 },
  row: {
    flex: 1,
    justifyContent: "space-evenly",
  },
});

export default ChampionMasteriesByLevel;
