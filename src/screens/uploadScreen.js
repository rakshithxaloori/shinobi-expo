import React, { Component } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

import { flashAlert } from "../utils/flash_message";
import { darkTheme } from "../utils/theme";
import { createAPIKit, uploadFileToS3 } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import SelectVideo from "../components/upload/selectVideo";
import TitleGame from "../components/upload/titleGame";

const VIDEO_MIN_LENGTH = 5;
const VIDEO_MAX_LENGTH = 21;
const VIDEO_SIZE_IN_MB = 100;

class UploadScreen extends Component {
  state = {
    screenNum: 0,
    is_uploading: undefined,
    videoQuota: 0,
    timeLeft: null,
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
      const { quota, time_left } = response.data?.payload;
      this.setState({
        videoQuota: quota,
        timeLeft: time_left,
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
          if (result.duration < VIDEO_MIN_LENGTH * 1000) {
            flashAlert("Video has to be atleast 5 seconds");
          } else if (result.duration > VIDEO_MAX_LENGTH * 1000) {
            flashAlert("Video has to be shorter than 20 seconds");
          } else {
            const videoInfo = await FileSystem.getInfoAsync(result.uri);
            if (videoInfo.size > VIDEO_SIZE_IN_MB * 1000 * 1000) {
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

            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
            this.props.navigation.dispatch(resetAction);
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

  clearVideo = () =>
    this.setState({
      videoUri: null,
      videoHeight: null,
      videoHeightToWidthRatio: null,
    });

  render = () =>
    this.state.loaded ? (
      <View style={styles.container}>
        <Text style={styles.title}>
          You can upload {this.state.videoQuota} more{" "}
          {this.state.videoQuota === 1 ? "clip" : "clips"} today
        </Text>
        {this.state.videoQuota === 0 && (
          <Text style={styles.subTitle}>
            {this.state.timeLeft} until you can upload more clips
          </Text>
        )}
        <Text style={styles.subTitle}>
          Upload a clip that is b/w {VIDEO_MIN_LENGTH} and{" "}
          {VIDEO_MAX_LENGTH - 1} seconds long{" "}
        </Text>
        {this.state.screenNum === 0
          ? this.state.videoQuota > 0 && (
              <SelectVideo
                videoUri={this.state.videoUri}
                videoHeight={this.state.videoHeight}
                disable={this.state.disable}
                clearVideo={this.clearVideo}
                nextScreen={() => {
                  this.setState({ screenNum: 1 });
                }}
                selectVideo={this.selectVideo}
                selectText={this.state.selectText}
              />
            )
          : this.state.screenNum === 1
          ? this.state.videoUri && (
              <TitleGame
                is_uploading={this.state.is_uploading}
                disable={this.state.disable}
                onChangeText={(value) => {
                  this.setState({
                    title: value.trim(),
                  });
                }}
                uploadVideo={this.uploadVideo}
              />
            )
          : null}
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
    margin: 10,
  },
  title: {
    color: darkTheme.on_background,
    fontWeight: "bold",
    fontSize: 20,
    padding: 20,
  },
  subTitle: {
    fontSize: 16,
    color: darkTheme.on_surface_subtitle,
    fontWeight: "500",
  },
  icon: { marginRight: 8 },
  button: { borderRadius: 30, padding: 15, margin: 10, flexDirection: "row" },
  selectText: { color: darkTheme.on_background },
});

export default UploadScreen;
