import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "react-native-elements";

import { darkTheme } from "../../utils/theme";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = 25;

const TitleGame = ({ is_uploading, disable, onChangeText, uploadVideo }) => {
  return (
    <View style={styles.container}>
      <Input
        editable={!disable}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={40}
        placeholder="One tap headshots y'all!"
        label="Clip title"
        inputStyle={{ color: darkTheme.on_background, fontSize: 15 }}
        leftIcon={() => (
          <Ionicons name="film-outline" size={20} color={darkTheme.primary} />
        )}
        onChangeText={onChangeText}
        style={styles.clipLabel}
      />
      {is_uploading ? (
        <Text style={styles.uploadingText}>Uploading clip...</Text>
      ) : (
        <TouchableOpacity
          disabled={disable}
          onPress={uploadVideo}
          style={styles.uploadButton}
        >
          <Ionicons
            style={styles.icon}
            name="cloud-upload"
            size={ICON_SIZE}
            color={darkTheme.primary}
          />
          <Text style={styles.uploadText}>Upload Video</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: height / 2,
    marginVertical: 20,
  },
  clipLabel: {
    width: "100%",
    height: "20%",
  },
  icon: { marginRight: 8 },
  uploadingText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: darkTheme.primary,
    color: darkTheme.on_background,
    borderRadius: 30,
    padding: 15,
    margin: 20,
    alignSelf: "center",
  },
  uploadText: { fontSize: 18, fontWeight: "bold", color: darkTheme.primary },
  uploadButton: {
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
});

export default TitleGame;
