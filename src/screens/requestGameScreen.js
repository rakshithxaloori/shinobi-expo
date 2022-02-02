import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

import { darkTheme } from "../utils/theme";
import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { handleAPIError } from "../utils";

const ICON_SIZE = 20;

const RequestGame = ({ navigation }) => {
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  const [disable, setDisable] = useState(false);
  const [gameName, setGameName] = useState("");

  const postGameName = async () => {
    setDisable(true);
    const onSuccess = () => {
      flashAlert(`'${gameName}' will be added soon!`);
      navigation.goBack();
    };

    const APIKIT = await createAPIKit();
    APIKIT.post(
      "support/game/request/",
      { game_name: gameName },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputParent}>
        <Ionicons
          name="game-controller-outline"
          size={ICON_SIZE}
          color={darkTheme.on_surface_subtitle}
        />
        <TextInput
          editable={!disable}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholderTextColor={darkTheme.on_surface_subtitle}
          multiline
          maxLength={140}
          placeholder="Game Name"
          value={gameName}
          onChangeText={(value) => {
            const newValue = value.replace(/\s+/g, " ");
            setGameName(newValue);
          }}
        />
      </View>

      <TouchableOpacity
        disabled={disable}
        onPress={postGameName}
        style={styles.button}
      >
        <MaterialCommunityIcons
          style={styles.icon}
          name="gamepad-round"
          size={ICON_SIZE}
          color={darkTheme.primary}
        />
        <Text style={styles.btnText}>Request Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { marginRight: 8 },
  btnText: { fontSize: 18, fontWeight: "bold", color: darkTheme.primary },
  button: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 15,
    margin: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.background,
  },
  inputParent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: darkTheme.surface,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    marginLeft: 5,
    width: "90%",
    color: darkTheme.on_background,
  },
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RequestGame;
