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
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import axios from "axios";

import { flashAlert } from "../utils/flash_message";
import { darkTheme } from "../utils/theme";
import { createAPIKit, uploadFileToS3 } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import VideoPlayer from "../utils/uploadPlayer";

const { width, height } = Dimensions.get("window");
const iconSize = 25;

class UploadScreen extends Component {
  state = {
    is_uploading: undefined,
    videoQuota: 0,
    videoUri: null,
    videoHeight: null,
    videoHeightToWidthRatio: null,
    selectText: "Select",
    title: "",
    file_key: null,
    disable: true,
    loaded: false,
  };
  cancelTokenSource = axios.CancelToken.source();

  componentDidMount = async () => {
    const APIKit = await createAPIKit();
    const onSuccess = (response) => {
      const { quota } = response.data?.payload;
      this.setState({
        videoQuota: quota,
        disable: false,
        loaded: true,
      });
    };

    APIKit.get("/clips/check/", { cancelToken: this.cancelTokenSource.token })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
      });

    const beforeRemove = (e) => {
      if (this.state.is_uploading) {
        e.preventDefault();
        flashAlert("Uploading clip...", "Don't close the app", undefined, 5000);
      }
    };

    this.props.navigation.addListener("beforeRemove", beforeRemove);
  };

  componentWillUnmount = () => {
    this.cancelTokenSource.cancel();
  };

  selectVideo = async () => {
    if (Platform.OS != "web") {
      this.setState({ selectText: "Fetching", disable: true });
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
          // Check atleast 10 secs, atmost 20 secs
          if (result.duration < 5 * 1000) {
            flashAlert("Video has to be atleast 5 seconds");
          } else if (result.duration > 21 * 1000) {
            flashAlert("Video has to be shorter than 20 seconds");
          } else {
            const videoInfo = await FileSystem.getInfoAsync(result.uri);
            if (videoInfo.size > 100 * 1000 * 1000) {
              flashAlert("Video should be smaller than 100 MB");
            } else {
              let videoHeightToWidthRatio = null;
              let videoHeight = null;
              if (result.rotation) {
                videoHeight = result.width;
                videoHeightToWidthRatio = (result.width * 1.0) / result.height;
              } else {
                videoHeight = result.height;
                videoHeightToWidthRatio = (result.height * 1.0) / result.width;
              }
              this.setState({
                videoUri: result.uri,
                videoHeight,
                videoHeightToWidthRatio,
              });
            }
          }
        }
      } else {
        flashAlert("Sorry, we need camera roll permissions to make this work!");
      }
      this.setState({ selectText: "Select", disable: false });
    }
  };

  uploadVideo = async () => {
    if (this.state.videoUri === null) return;
    if (this.state.title == "") {
      flashAlert("Clip title can't be empty", undefined, undefined, 5000);
      return;
    }
    this.setState({ disable: true, is_uploading: true });

    const splitList = this.state.videoUri.split(".");
    const videoInfo = await FileSystem.getInfoAsync(this.state.videoUri);

    // Get the S3 presigned URL
    try {
      const uploadSuccess = async (response) => {
        // Send that upload is successful
        const APIKit = await createAPIKit();
        const onSuccess = () => {
          const callback = () => {
            flashAlert("Clip uploaded!", undefined, undefined, 5000);
            this.props.navigation.navigate("Home");
          };
          this.setState({ is_uploading: false }, callback);
        };
        APIKit.post(
          "/clips/success/",
          { file_key: this.state.file_key },
          { cancelToken: this.cancelTokenSource.token }
        )
          .then(onSuccess)
          .catch((e) => {
            flashAlert(handleAPIError(e));
          });
      };
      const uploadFailure = (error) => {
        this.setState({ disable: false, is_uploading: false });
        flashAlert(handleAPIError(error));
      };

      const APIKit = await createAPIKit();
      const get_s3_url_response = await APIKit.post(
        "/clips/presigned/",
        {
          clip_size: videoInfo.size,
          clip_type: splitList[splitList.length - 1],
          game_code: "30035",
          title: this.state.title,
          clip_height_to_width_ratio: this.state.videoHeightToWidthRatio,
        },
        { cancelToken: this.cancelTokenSource.token }
      );

      if (get_s3_url_response.status === 200) {
        const url_payload = get_s3_url_response.data.payload;

        this.setState({ file_key: url_payload.fields.key });
        flashAlert("Uploading clip...", "Don't close the app", undefined, 5000);
        uploadFileToS3(url_payload.url, this.state.videoUri, url_payload.fields)
          .then(uploadSuccess)
          .catch(uploadFailure);
      }
    } catch (e) {
      this.setState({ disable: false, is_uploading: false });
      flashAlert(handleAPIError(e));
    }
  };

  render = () =>
    this.state.loaded ? (
      <View style={styles.container}>
        <Text style={styles.title}>
          You can upload {this.state.videoQuota} more{" "}
          {this.state.videoQuota === 1 ? "clip" : "clips"} today
        </Text>
        {this.state.videoUri && (
          <View style={styles.videoView}>
            <VideoPlayer
              videoUri={this.state.videoUri}
              videoHeight={this.state.videoHeight}
            />
            <Input
              editable={!this.state.disable}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
              placeholder="One tap headshots y'all!"
              label="Clip title"
              inputStyle={{ color: darkTheme.on_background, fontSize: 15 }}
              leftIcon={() => (
                <Ionicons
                  name="film-outline"
                  size={20}
                  color={darkTheme.primary}
                />
              )}
              onChangeText={(value) => {
                this.setState({
                  title: value.trim(),
                });
              }}
              style={styles.clipLabel}
            />
          </View>
        )}
        {this.state.videoQuota > 0 && (
          <View style={styles.buttonsView}>
            {this.state.is_uploading ? (
              <Text style={styles.uploadingText}>Uploading clip...</Text>
            ) : this.state.videoUri ? (
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
                  {this.state.selectText} Video
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    ) : (
      <View style={styles.container} />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: darkTheme.on_background,
    fontWeight: "bold",
    fontSize: 20,
    padding: 20,
  },
  uploadingText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: darkTheme.primary,
    color: darkTheme.on_background,
    borderRadius: 30,
    padding: 15,
    margin: 20,
  },
  videoView: {
    width: width - 40,
    height: height / 2,
    marginBottom: 20,
  },
  clipLabel: {
    width: "100%",
    height: "20%",
  },
  buttonsView: {
    margin: 10,
    flexDirection: "row",
  },
  icon: { marginRight: 8 },
  button: { borderRadius: 30, padding: 15, margin: 10, flexDirection: "row" },
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
