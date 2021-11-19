import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Video, AVPlaybackStatus } from "expo-av";

import { flashAlert } from "../utils/flash_message";
import { darkTheme } from "../utils/theme";
import { uploadFile } from "../utils/APIKit";
import { handleAPIError } from "../utils";

const { width, height } = Dimensions.get("window");
const iconSize = 25;

class UploadScreen extends Component {
  state = {
    videoUri: null,
    status: {},
    disable: false,
  };
  video = React.createRef();
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    // TODO
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  selectVideo = async () => {
    if (Platform.OS != "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status == "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true, // works on iOS
          quality: 1,
          base64: true,
        });

        if (!result.cancelled) {
          // Check atleast 10 secs, atmost 5 mins
          if (result.duration < 10000) {
            flashAlert("Video has to be atleast 10 seconds");
          } else if (result.duration > 120000) {
            flashAlert("Video has to be shorter than 2 minutes");
          } else this.setState({ videoUri: result.uri });
        }
      } else {
        flashAlert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  uploadVideo = async () => {
    if (this.state.videoUri === null) return;
    this.setState({ disable: true });

    const onSuccess = (response) => {
      this.setState({ disable: true });
      this.props.navigation.navigate("Home");
    };

    const splitList = this.state.videoUri.split(".");

    flashAlert("Uploading video...", undefined, undefined, 5000);

    uploadFile("/clips/upload/", this.state.videoUri, "clip", {
      game_code: "League",
      type: splitList[splitList.length - 1],
    })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
        this.setState({ disable: false });
      });

    // APIKit.post("/clips/upload/", formData, {
    //   headers: {
    //     "content-type": "multipart/form-data",
    //     "Content-Length": videoSize,
    //   },
    //   cancelToken: this.cancelTokenSource.token,
    // })
    //   .then(onSuccess)
    //   .catch((e) => {
    //     flashAlert(handleAPIError(e));
    //     this.setState({ disable: false });
    //   });
  };

  render = () => (
    <View style={styles.container}>
      <Text style={styles.title}>You can upload upto 5 clips each day</Text>
      {this.state.videoUri && (
        <Video
          ref={this.video}
          style={styles.video}
          source={{
            uri: this.state.videoUri,
          }}
          // posterSource={{ uri: "" }}
          useNativeControls
          resizeMode="contain"
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.error) {
              flashAlert("Upload failed");
            } else {
              this.setState(status);
            }
          }}
        />
      )}
      <View style={styles.buttonsView}>
        {this.state.videoUri ? (
          <View style={styles.buttonsView}>
            <TouchableOpacity
              disabled={this.state.disable}
              onPress={() => this.setState({ videoUri: null })}
              style={[styles.button, styles.selectButton]}
            >
              <Ionicons
                style={styles.icon}
                name="trash-bin-outline"
                size={iconSize}
                color={darkTheme.on_background}
              />
              <Text style={[styles.buttonText, styles.selectText]}>
                Clear Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={this.state.disable}
              onPress={this.uploadVideo}
              style={[styles.button, styles.uploadButton]}
            >
              <Ionicons
                style={styles.icon}
                name="cloud-upload"
                size={iconSize}
                color={darkTheme.primary}
              />
              <Text style={[styles.buttonText, styles.uploadText]}>
                Upload Video
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            disabled={this.state.disable}
            onPress={this.selectVideo}
            style={[styles.button, styles.selectButton]}
          >
            <Ionicons
              style={styles.icon}
              name="albums-outline"
              size={iconSize}
              color={darkTheme.on_background}
            />
            <Text style={[styles.buttonText, styles.selectText]}>
              Select Video
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    color: darkTheme.on_background,
    fontWeight: "bold",
    fontSize: 20,
    padding: 20,
  },
  video: { width: width, height: height / 3 },
  buttonsView: { margin: 10, flexDirection: "row" },
  icon: { marginRight: 8 },
  button: { borderRadius: 30, padding: 15, margin: 20, flexDirection: "row" },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  selectText: { color: darkTheme.on_background },
  uploadText: { color: darkTheme.primary },
  selectButton: {
    backgroundColor: darkTheme.primary,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.background,
  },
});

export default UploadScreen;
